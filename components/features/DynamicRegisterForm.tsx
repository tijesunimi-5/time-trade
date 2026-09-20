'use client';

import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Input } from '../ui/Input';

interface DynamicField {
  id: string;
  fieldName: string;
  label: string;
  fieldType: 'text' | 'textarea' | 'select' | 'multiselect' | 'checkbox' | 'date';
  isRequired: boolean;
  options?: string;
  displayOrder: number;
  isActive: boolean;
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
        if (res.fields) {
          const activeFields = res.fields.filter((f: DynamicField) => f.isActive);
          setFields(activeFields);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading || fields.length === 0) return null;

  const handleCheckboxToggle = (fieldName: string, option: string) => {
    const currentList: string[] = Array.isArray(formData[fieldName]) ? formData[fieldName] : [];
    const updatedList = currentList.includes(option)
      ? currentList.filter((item) => item !== option)
      : [...currentList, option];
    onChange(fieldName, updatedList);
  };

  return (
    <div className="space-y-4 pt-1">
      {fields.map((field) => {
        const value = formData[field.fieldName] ?? '';

        if (field.fieldType === 'textarea') {
          return (
            <div key={field.id} className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                {field.label} {field.isRequired && <span className="text-rose-500">*</span>}
              </label>
              <textarea
                placeholder="Type your response..."
                rows={3}
                value={value}
                onChange={(e) => onChange(field.fieldName, e.target.value)}
                required={field.isRequired}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white shadow-xs"
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
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white shadow-xs"
              >
                <option value="">-- Select option --</option>
                {choices.map((choice, i) => (
                  <option key={i} value={choice}>{choice}</option>
                ))}
              </select>
            </div>
          );
        }

        if (field.fieldType === 'multiselect') {
          let choices: string[] = [];
          try {
            choices = field.options ? JSON.parse(field.options) : [];
          } catch {
            choices = [];
          }

          const selectedValues: string[] = Array.isArray(value) ? value : [];

          return (
            <div key={field.id} className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                {field.label} {field.isRequired && <span className="text-rose-500">*</span>}
              </label>
              <div className="space-y-1.5 p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                {choices.map((choice, i) => {
                  const isChecked = selectedValues.includes(choice);
                  return (
                    <label
                      key={i}
                      className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-white transition-colors cursor-pointer text-xs font-medium text-slate-800"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleCheckboxToggle(field.fieldName, choice)}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                      />
                      <span>{choice}</span>
                    </label>
                  );
                })}
              </div>
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
            placeholder={`Enter your ${field.label.toLowerCase()}`}
            value={value}
            onChange={(e) => onChange(field.fieldName, e.target.value)}
            required={field.isRequired}
          />
        );
      })}
    </div>
  );
};
