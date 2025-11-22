import { Agent, run } from '@openai/agents';
import { z } from 'zod';

// Set the OpenAI API key for browser environment
// The @openai/agents library needs this to be set explicitly in the browser
if (import.meta.env.VITE_OPENAI_API_KEY) {
  // Set the API key globally for the agents library
  globalThis.OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
  // Also set it in process.env for compatibility
  if (typeof globalThis.process === 'undefined') {
    globalThis.process = { env: {} };
  }
  globalThis.process.env.OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
}

// Define structured output schemas
const ActionItemSchema = z.object({
  title: z.string(),
  timeline_months: z.number(),
  priority: z.number().min(1).max(8),
  category: z.string(),
  description: z.string()
});

const HomeBuyingPlanSchema = z.object({
  action_items: z.array(ActionItemSchema),
  total_timeline_months: z.number(),
  budget_analysis: z.object({
    affordable_price_range: z.string(),
    monthly_payment_estimate: z.string(),
    down_payment_needed: z.string()
  }),
  quick_wins: z.array(z.string()),
  next_immediate_steps: z.array(z.string())
});

// Agent configurations
const FINANCIAL_ADVISOR_AGENT = new Agent({
  name: 'Financial Advisor Agent',
  model: 'gpt-4o',
  temperature: 0,
  instructions: `You are a specialized financial advisor for home buyers. Your role is to:
- Analyze user's financial situation (income, savings, expenses)
- Calculate affordability and mortgage capacity
- Create personalized savings strategies
- Recommend financial optimization steps
- Provide realistic timelines for achieving financial goals
- Address risk tolerance and financial planning

IMPORTANT: Always respond with structured JSON data containing:
- Financial analysis
- Affordability calculations
- Recommended actions with timelines
- Risk assessment

Ask targeted questions to understand their financial position but keep it concise. Focus on actionable financial advice.`,
});

const MARKET_RESEARCH_AGENT = new Agent({
  name: 'Market Research Agent',
  model: 'gpt-4o',
  temperature: 0,
  instructions: `You are a real estate market specialist. Your role is to:
- Provide location-specific housing market insights
- Analyze property types and pricing trends
- Suggest optimal timing for purchases
- Recommend alternative locations or property types
- Give market-based reality checks on expectations
- Provide lifestyle and location recommendations

IMPORTANT: Always respond with structured data including:
- Market analysis for the specified location
- Price trends and forecasts
- Alternative recommendations
- Timing suggestions

Focus on practical market knowledge and location-specific advice.`,
});

const TRIAGE_AGENT = new Agent({
  name: 'InterFox Action Planner',
  model: 'gpt-4o',
  temperature: 0,
  instructions: `You are InterFox Action Planner, an AI assistant helping users achieve their dream home through personalized financial and lifestyle recommendations.

## Your Role
Analyze user's financial situation and home goals, then generate a prioritized action plan with concrete, achievable steps.

## Core Responsibilities
- Determine whether to use Financial Advisor Agent for financial analysis or Market Research Agent for location/market insights
- Synthesize information from both agents when needed
- Generate final prioritized action plans with 5-8 concrete steps
- Balance financial actions with lifestyle changes
- Provide realistic timelines (0-6 months short-term, 6-24 months medium-term)
- Include at least one "quick win" for motivation

## CRITICAL: Output Format
You MUST respond with a valid JSON object matching this exact structure:
{
  "action_items": [
    {
      "title": "Action Title",
      "timeline_months": 6,
      "priority": 1,
      "category": "financial",
      "description": "Detailed description of the action"
    }
  ],
  "total_timeline_months": 24,
  "budget_analysis": {
    "affordable_price_range": "€800,000 - €1,200,000",
    "monthly_payment_estimate": "€3,500 - €4,200",
    "down_payment_needed": "€160,000 - €240,000"
  },
  "quick_wins": ["List of immediate actions"],
  "next_immediate_steps": ["Next 1-2 actions to take"]
}

## Instructions
- Be realistic and encouraging
- Ask minimal but targeted questions to understand user needs
- Avoid filler words like "thanks, how can I help"
- Acknowledge emotional aspects of homeownership journey
- Adapt advice to user's risk tolerance
- ALWAYS return valid JSON only, no additional text`,
  handoffs: [FINANCIAL_ADVISOR_AGENT, MARKET_RESEARCH_AGENT],
});

// Main function to run the home buying assistant with structured output
async function runHomeBuyingAssistant(userQuery: string) {
  try {
    const result = await run(TRIAGE_AGENT, userQuery);
    return result.finalOutput;
  } catch (error) {
    console.error('Error running home buying assistant:', error);
    throw error;
  }
}

// Function to get structured and validated output
async function getStructuredHomeBuyingPlan(userQuery: string) {
  try {
    const rawResult = await runHomeBuyingAssistant(userQuery);
    
    // Try to parse the JSON response
    let jsonResult;
    try {
      // Extract JSON from the response if it's wrapped in text
      const jsonMatch = rawResult.match(/\{[\s\S]*\}/);
      jsonResult = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(rawResult);
    } catch (parseError) {
      throw new Error(`Failed to parse JSON response: ${parseError}`);
    }
    
    // Validate against our schema
    const validatedResult = HomeBuyingPlanSchema.parse(jsonResult);
    return validatedResult;
    
  } catch (error) {
    console.error('Error getting structured plan:', error);
    throw error;
  }
}

// Export for use in other modules
export { 
  runHomeBuyingAssistant, 
  getStructuredHomeBuyingPlan,
  HomeBuyingPlanSchema,
  ActionItemSchema,
  FINANCIAL_ADVISOR_AGENT, 
  MARKET_RESEARCH_AGENT, 
  TRIAGE_AGENT 
};