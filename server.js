import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { Agent, run } from '@openai/agents';
import { z } from 'zod';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

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
const EVENT_CLASSIFIER_AGENT = new Agent({
  name: 'Event clssifier Agent',
  model: 'gpt-4o',
  temperature: 0,
  instructions: `You are a specialized event classifier agent. Your role is to:
- take some event details from user (e.g. going on a vacation to spain next week, got bonus from stocks)
- predict the event into one of two classes: spend/income
- Predict amount of event
- Return strict JSON response
- Do not ask followup question

IMPORTANT: Always respond with structured JSON data containing:
- Event class: spend or income
- Amount (money in euro)

e.g. if user says he/she got bonus from stocks, then return JSON as
{"event_type": "income", "amount": 5000}
`,
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

Focus on actionable financial advice.`,
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
You MUST respond with a strict JSON object(without extract wrapper) matching this exact structure:
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
- Do not ask questions
- Avoid filler words like "thanks, how can I help"
- Acknowledge emotional aspects of homeownership journey
- Adapt advice to user's risk tolerance
- ALWAYS return valid JSON only, no additional text`,
  handoffs: [FINANCIAL_ADVISOR_AGENT, MARKET_RESEARCH_AGENT],
});

// API Routes
app.post('/api/classify-event', async (req, res) => {
  try {
    const { eventText } = req.body;

    if (!eventText) {
      return res.status(400).json({ error: 'eventText is required' });
    }

    console.log('Classifying event:', eventText);

    // Run the agent
    const result = await run(EVENT_CLASSIFIER_AGENT, eventText);
    const rawResult = result.finalOutput;
    
    console.log('Raw AI response:', rawResult);

    // Try to parse the JSON response
    let jsonResult;
    try {
      // Remove markdown code blocks if present
      const cleanedResult = rawResult.replace(/```json/g, '').replace(/```/g, '');
      
      // Extract JSON from the response if it's wrapped in text
      const jsonMatch = cleanedResult.match(/\{[\s\S]*\}/);
      jsonResult = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(cleanedResult);
    } catch (parseError) {
      console.error('JSON parse error:', parseError.message);
      return res.status(500).json({ 
        error: 'Failed to parse AI response as JSON',
        rawResponse: rawResult 
      });
    }
    
    res.json(jsonResult);

  } catch (error) {
    console.error('Error classifying event:', error.message);
    res.status(500).json({ 
      error: 'Failed to classify event',
      message: error.message 
    });
  }
});

app.post('/api/generate-plan', async (req, res) => {
  try {
    const { userQuery } = req.body;

    if (!userQuery) {
      return res.status(400).json({ error: 'userQuery is required' });
    }

    console.log('Generating plan for query:', userQuery);

    // Run the agent
    // const result = await run(TRIAGE_AGENT, userQuery);
    // const rawResult = result.finalOutput;
        
    // Read from demo file instead of calling AI
    const rawResult = fs.readFileSync('demo_ai_suggestion.json', 'utf-8');

    // Try to parse the JSON response
    let jsonResult;
    console.log('Raw AI response:', rawResult);
    try {
      // Remove markdown code blocks if present
      const cleanedResult = rawResult.replace(/```json/g, '').replace(/```/g, '');
      console.log('Refined AI response:', rawResult);


      // Extract JSON from the response if it's wrapped in text
      const jsonMatch = cleanedResult.match(/\{[\s\S]*\}/);
      jsonResult = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(cleanedResult);
    } catch (parseError) {
      console.error('JSON parse error:', parseError.message);
      // Log additional details if available without crashing
      if (parseError.cause) console.error('Cause:', parseError.cause);
      return res.status(500).json({ 
        error: 'Failed to parse AI response as JSON',
        rawResponse: rawResult 
      });
    }

    // Validate against our schema
    const validatedResult = HomeBuyingPlanSchema.parse(jsonResult);
    
    res.json(validatedResult);

  } catch (error) {
    console.error('Error generating plan:', error.message);
    // Log additional details if available without crashing
    if (error.cause) console.error('Cause:', error.cause);
    
    res.status(500).json({ 
      error: 'Failed to generate home buying plan',
      message: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Intel Agent Server is running' });
});

app.listen(port, () => {
  console.log(`🚀 Intel Agent Server running at http://localhost:${port}`);
  console.log(`✅ OpenAI API Key: ${process.env.OPENAI_API_KEY ? 'Configured' : 'Missing'}`);
});