'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload } from 'lucide-react';

export default function OwnerSetupPage() {
  const [formData, setFormData] = useState<{
    fullName: string;
    phoneNumber: string;
    profileImage: File | null;
    bio: string;
    experienceYears: string;
    languages: string;
    location: string;
    servicesOffered: string;
    availableProperties: string;
    propertyTypes: string;
    licenseNumber: string;
    socialLinks: string;
    paymentMethods: string;
    termsAccepted: boolean;
  }>({
    fullName: '',
    phoneNumber: '',
    profileImage: null,
    bio: '',
    experienceYears: '',
    languages: '',
    location: '',
    servicesOffered: '',
    availableProperties: '',
    propertyTypes: '',
    licenseNumber: '',
    socialLinks: '',
    paymentMethods: '',
    termsAccepted: false,
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleChange('profileImage', file);
  };

  return (
    <div className="min-h-screen px-4 py-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Профиль владельца</h1>
      <form className="grid gap-6">
        <div>
          <Label>Полное имя</Label>
          <Input value={formData.fullName} onChange={(e) => handleChange('fullName', e.target.value)} />
        </div>

        <div>
          <Label>Телефон</Label>
          <Input value={formData.phoneNumber} onChange={(e) => handleChange('phoneNumber', e.target.value)} />
        </div>

        <div>
          <Label>Фото профиля</Label>
          <div className="flex items-center gap-4">
            <Input type="file" accept="image/*" onChange={handleFileChange} />
            {formData.profileImage && <span>{formData.profileImage.name}</span>}
          </div>
        </div>

        <div>
          <Label>О себе</Label>
          <Textarea value={formData.bio} onChange={(e) => handleChange('bio', e.target.value)} />
        </div>

        <div>
          <Label>Опыт (лет)</Label>
          <Input type="number" value={formData.experienceYears} onChange={(e) => handleChange('experienceYears', e.target.value)} />
        </div>

        <div>
          <Label>Языки</Label>
          <Input value={formData.languages} onChange={(e) => handleChange('languages', e.target.value)} />
        </div>

        <div>
          <Label>Город / Страна</Label>
          <Input value={formData.location} onChange={(e) => handleChange('location', e.target.value)} />
        </div>

        <div>
          <Label>Доп. услуги</Label>
          <Textarea value={formData.servicesOffered} onChange={(e) => handleChange('servicesOffered', e.target.value)} placeholder="уборка, трансфер и т.п." />
        </div>

        <div>
          <Label>Кол-во объектов</Label>
          <Input type="number" value={formData.availableProperties} onChange={(e) => handleChange('availableProperties', e.target.value)} />
        </div>

        <div>
          <Label>Типы объектов</Label>
          <Input value={formData.propertyTypes} onChange={(e) => handleChange('propertyTypes', e.target.value)} placeholder="квартира, дом, апартаменты..." />
        </div>

        <div>
          <Label>Лицензия</Label>
          <Input value={formData.licenseNumber} onChange={(e) => handleChange('licenseNumber', e.target.value)} />
        </div>

        <div>
          <Label>Соцсети</Label>
          <Input value={formData.socialLinks} onChange={(e) => handleChange('socialLinks', e.target.value)} placeholder="Instagram, LinkedIn..." />
        </div>

        <div>
          <Label>Методы оплаты</Label>
          <Input value={formData.paymentMethods} onChange={(e) => handleChange('paymentMethods', e.target.value)} placeholder="карта, наличные..." />
        </div>

        <div className="flex items-center gap-4">
          <Switch checked={formData.termsAccepted} onCheckedChange={(val) => handleChange('termsAccepted', val)} className="data-[state=checked]:bg-orange-500" />
          <Label>Я принимаю условия платформы</Label>
        </div>

        <Button type="submit">Сохранить профиль</Button>
      </form>
    </div>
  );
}