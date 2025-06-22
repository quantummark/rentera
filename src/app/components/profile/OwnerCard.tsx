'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

interface OwnerCardProps {
  name: string;
  bio: string;
  location?: string;
  email?: string;
  phone?: string;
  socials?: {
    instagram?: string;
    telegram?: string;
    facebook?: string;
  };
  avatar?: string;
}

export default function OwnerCard({
  name,
  bio,
  location,
  email,
  phone,
  socials,
  avatar,
}: OwnerCardProps) {
  return (
    <Card className="w-full rounded-2xl shadow-md border bg-card p-6 md:flex md:items-center md:gap-6">
      {/* Аватар */}
      <div className="flex justify-center md:justify-start mb-4 md:mb-0">
        <Avatar className="w-24 h-24 ring-2 ring-orange-500">
          <AvatarImage src={avatar} alt={name} />
        </Avatar>
      </div>

      {/* Инфо */}
      <CardContent className="flex-1 p-0 space-y-2">
        <h2 className="text-xl font-bold">{name}</h2>
        

        {/* Локация */}
        {location && (
          <div className="flex items-center text-sm text-muted-foreground gap-2 mt-2">
            <MapPin size={16} className="text-orange-500" />
            <span>{location}</span>
          </div>
        )}

        <p className="text-muted-foreground">{bio}</p>

        {/* Контакты */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
          {email && (
            <div className="flex items-center gap-1">
              <Mail size={14} />
              <span>{email}</span>
            </div>
          )}
          {phone && (
            <div className="flex items-center gap-1">
              <Phone size={14} />
              <span>{phone}</span>
            </div>
          )}
          {socials?.instagram && (
            <div className="flex items-center gap-1">
              <Globe size={14} />
              <a
                href={socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-orange-500 transition"
              >
                Instagram
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
