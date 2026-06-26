import { Select, Text } from '@mantine/core';
import { LANGUAGE_OPTIONS, type LanguageCode } from '@/shared/languages';
import './LanguageSelectField.css';

type LanguageSelectFieldProps = {
  label: string;
  value: LanguageCode;
  onChange: (value: string | null) => void;
  disabled?: boolean;
  loading?: boolean;
  placeholder?: string;
};

export function LanguageSelectField({
  label,
  value,
  onChange,
  disabled,
  loading = false,
  placeholder,
}: LanguageSelectFieldProps) {
  return (
    <div>
      <Text size="sm" fw={500} mb={6} className="language-select-label">
        {label}
      </Text>
      <Select
        disabled={disabled}
        searchable
        data={LANGUAGE_OPTIONS}
        value={value}
        onChange={onChange}
        loading={loading}
        placeholder={placeholder}
        classNames={{
          input: 'language-select-input',
          dropdown: 'language-select-dropdown',
          option: 'language-select-option',
        }}
      />
    </div>
  );
}
