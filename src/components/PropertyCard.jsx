import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Euro, Home, Maximize } from 'lucide-react';

export default function PropertyCard({ property }) {
  const {
    image,
    address = 'Address not available',
    price,
    propertyType,
    rooms,
    area,
    description
  } = property;

  return (
    <Card className="overflow-hidden border-2 border-orange-100 hover:border-orange-300 hover:shadow-xl transition-all group">
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-orange-100 to-orange-200 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={address}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Home className="w-16 h-16 text-orange-300" />
          </div>
        )}
        {propertyType && (
          <Badge className="absolute top-3 left-3 bg-white/90 text-gray-800 backdrop-blur-sm">
            {propertyType}
          </Badge>
        )}
      </div>

      <CardContent className="p-5 space-y-3">
        {/* Address */}
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-orange-600 mt-1 flex-shrink-0" />
          <p className="font-semibold text-gray-900 line-clamp-2 leading-snug">{address}</p>
        </div>

        {/* Price */}
        {price && (
          <div className="flex items-center gap-2">
            <Euro className="w-5 h-5 text-orange-600" />
            <span className="text-2xl font-bold text-orange-600">
              €{typeof price === 'number' ? price.toLocaleString() : price}
            </span>
          </div>
        )}

        {/* Details */}
        <div className="flex items-center gap-4 text-sm text-gray-600 pt-2 border-t border-gray-100">
          {rooms && (
            <div className="flex items-center gap-1">
              <Home className="w-4 h-4" />
              <span>{rooms} rooms</span>
            </div>
          )}
          {area && (
            <div className="flex items-center gap-1">
              <Maximize className="w-4 h-4" />
              <span>{area} m²</span>
            </div>
          )}
        </div>

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-600 line-clamp-2 pt-2">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}