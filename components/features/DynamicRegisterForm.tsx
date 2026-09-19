'use client';

import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Input } from '../ui/Input';

interface DynamicField {
  id: string;
  fieldName: string;
  label: string;
  fieldType: 'text' | 'textarea' | 'select' | 'checkbox' | 'date';
  isRequired: boolean;
  options?: string;
  displayOrder: number;
}

interface DynamicRegisterFormProps {
  formData: Record<string, any>;
  onChange: (fieldName: string, value: any) => void;
}

export const DynamicRegisterForm: React.FC<DynamicRegisterFormProps> = ({ formData, onChange }) => {
  const [fields, setFields] = useState<DynamicField[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getDynamicFormFields()
      .then((res) => {
        if (res.fields) setFields(res.fields);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading || fields.length === 0) return null;

  return (
    <div className="space-y-3 pt-1">
      {fields.map((field) => {
        const value = formData[field.fieldName] || '';

        if (field.fieldType === 'textarea') {
          return (
            <div key={field.id} className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                {field.label} {field.isRequired && <span className="text-rose-500">*</span>}
              </label>
              <textarea
                placeholder="Share your response..."
                rows={2}
                value={value}
                onChange={(e) => onChange(field.fieldName, e.target.value)}
                required={field.isRequired}
                className="w-full px-3.5 py-2 rounded-xl glass-input text-xs font-medium placeholder:text-slate-400"
              />
            </div>
          );
        }

        if (field.fieldType === 'select') {
          let choices: string[] = [];
          try {
            choices = field.options ? JSON.parse(field.options) : [];
          } catch {
            choices = [];
          }

          return (
            <div key={field.id} className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                {field.label} {field.isRequired && <span className="text-rose-500">*</span>}
              </label>
              <select
                value={value}
                onChange={(e) => onChange(field.fieldName, e.target.value)}
                required={field.isRequired}
                className="w-full px-3.5 py-2 rounded-xl glass-input text-xs font-medium"
              >
                <option value="">-- Select option --</option>
                {choices.map((choice, i) => (
                  <option key={i} value={choice}>{choice}</option>
                ))}
              </select>
            </div>
          );
        }

        if (field.fieldType === 'date') {
          return (
            <Input
              key={field.id}
              label={field.label}
              type="date"
              value={value}
              onChange={(e) => onChange(field.fieldName, e.target.value)}
              required={field.isRequired}
            />
          );
        }

        return (
          <Input
            key={field.id}
            label={field.label}
            placeholder={field.label}
            value={value}
            onChange={(e) => onChange(field.fieldName, e.target.value)}
            required={field.isRequired}
          />
        );
      })}
    </div>
  );
};
