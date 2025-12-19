import { useState, useCallback } from 'react';

/**
 * Hook personalizado para validación de formularios en tiempo real
 * Proporciona validación, manejo de errores y estado del formulario
 */
export function useFormValidation(initialValues = {}, validationRules = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validar un campo específico
  const validateField = useCallback((name, value, rules) => {
    if (!rules) return null;

    // Validación requerida
    if (rules.required && (!value || value.trim() === '')) {
      return rules.requiredMessage || `${name} es requerido`;
    }

    // Validación de email
    if (rules.email && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return rules.emailMessage || 'Email inválido';
      }
    }

    // Validación de longitud mínima
    if (rules.minLength && value && value.length < rules.minLength) {
      return rules.minLengthMessage || `Debe tener al menos ${rules.minLength} caracteres`;
    }

    // Validación de longitud máxima
    if (rules.maxLength && value && value.length > rules.maxLength) {
      return rules.maxLengthMessage || `No debe exceder ${rules.maxLength} caracteres`;
    }

    // Validación de patrón (regex)
    if (rules.pattern && value) {
      const regex = new RegExp(rules.pattern);
      if (!regex.test(value)) {
        return rules.patternMessage || 'Formato inválido';
      }
    }

    // Validación personalizada
    if (rules.validate && typeof rules.validate === 'function') {
      const customError = rules.validate(value);
      if (customError) {
        return customError;
      }
    }

    return null;
  }, []);

  // Manejar cambio en un campo
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setValues((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));

    // Validar en tiempo real si el campo ya fue tocado
    if (touched[name]) {
      const rules = validationRules[name];
      const error = validateField(name, fieldValue, rules);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  }, [touched, validationRules, validateField]);

  // Manejar blur (cuando el usuario sale del campo)
  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Validar el campo cuando el usuario sale
    const rules = validationRules[name];
    const error = validateField(name, value, rules);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  }, [validationRules, validateField]);

  // Validar todo el formulario
  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach((name) => {
      const rules = validationRules[name];
      const value = values[name];
      const error = validateField(name, value, rules);

      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    
    // Marcar todos los campos como tocados
    const allTouched = {};
    Object.keys(validationRules).forEach((name) => {
      allTouched[name] = true;
    });
    setTouched(allTouched);

    return isValid;
  }, [values, validationRules, validateField]);

  // Resetear el formulario
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  // Establecer valores manualmente
  const setValue = useCallback((name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  // Establecer error manualmente
  const setError = useCallback((name, error) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setValue,
    setError,
    isValid: Object.keys(errors).length === 0 || Object.values(errors).every((e) => !e),
  };
}

