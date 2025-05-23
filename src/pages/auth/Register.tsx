import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ShieldAlert, Mail, Lock, User, Building, MapPin } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/auth.types';

const Register: React.FC = () => {
  const { register, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>('public');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    jurisdiction: '',
    adminCode: '', // New field for admin registration
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    jurisdiction: '',
    adminCode: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    if (selectedRole === 'responder') {
      if (!formData.department.trim()) {
        newErrors.department = 'Department is required for responders';
        valid = false;
      }
      if (!formData.jurisdiction.trim()) {
        newErrors.jurisdiction = 'Jurisdiction is required for responders';
        valid = false;
      }
    }

    if (selectedRole === 'admin') {
      if (!formData.adminCode.trim()) {
        newErrors.adminCode = 'Admin code is required';
        valid = false;
      } else if (formData.adminCode !== 'ADMIN123') { // Example admin code
        newErrors.adminCode = 'Invalid admin code';
        valid = false;
      }
      if (!formData.department.trim()) {
        newErrors.department = 'Department is required for admins';
        valid = false;
      }
      if (!formData.jurisdiction.trim()) {
        newErrors.jurisdiction = 'Jurisdiction is required for admins';
        valid = false;
      }
    }
    
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: selectedRole,
        department: formData.department,
        jurisdiction: formData.jurisdiction,
      });
      navigate('/');
    } catch (error) {
      // Error is handled in the auth context
    }
  };

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center bg-primary-500 text-white h-16 w-16 rounded-lg mb-4">
            <ShieldAlert size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Join ResQ</h1>
          <p className="text-dark-300">Create your account to get started</p>
        </div>
        
        <div className="bg-dark-900 rounded-lg p-6 shadow-lg border border-dark-800">
          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-dark-200 mb-2">
              I want to register as:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                className={`p-3 rounded-lg border text-center transition-colors ${
                  selectedRole === 'public'
                    ? 'bg-primary-500/20 border-primary-500 text-primary-500'
                    : 'border-dark-700 text-dark-300 hover:border-dark-600'
                }`}
                onClick={() => setSelectedRole('public')}
              >
                <User size={20} className="mx-auto mb-1" />
                <span className="text-sm">Public User</span>
              </button>
              
              <button
                type="button"
                className={`p-3 rounded-lg border text-center transition-colors ${
                  selectedRole === 'responder'
                    ? 'bg-primary-500/20 border-primary-500 text-primary-500'
                    : 'border-dark-700 text-dark-300 hover:border-dark-600'
                }`}
                onClick={() => setSelectedRole('responder')}
              >
                <ShieldAlert size={20} className="mx-auto mb-1" />
                <span className="text-sm">Responder</span>
              </button>

              <button
                type="button"
                className={`p-3 rounded-lg border text-center transition-colors ${
                  selectedRole === 'admin'
                    ? 'bg-primary-500/20 border-primary-500 text-primary-500'
                    : 'border-dark-700 text-dark-300 hover:border-dark-600'
                }`}
                onClick={() => setSelectedRole('admin')}
              >
                <Building size={20} className="mx-auto mb-1" />
                <span className="text-sm">Admin</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <Input
              label="Full Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              leftIcon={<User size={18} />}
              error={errors.name}
              required
            />
            
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              leftIcon={<Mail size={18} />}
              error={errors.email}
              required
            />
            
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              leftIcon={<Lock size={18} />}
              error={errors.password}
              required
            />
            
            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              leftIcon={<Lock size={18} />}
              error={errors.confirmPassword}
              required
            />

            {/* Additional fields for responders and admins */}
            {(selectedRole === 'responder' || selectedRole === 'admin') && (
              <>
                <Input
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="Enter your department"
                  leftIcon={<Building size={18} />}
                  error={errors.department}
                  required
                />
                
                <Input
                  label="Jurisdiction"
                  name="jurisdiction"
                  value={formData.jurisdiction}
                  onChange={handleChange}
                  placeholder="Enter your jurisdiction"
                  leftIcon={<MapPin size={18} />}
                  error={errors.jurisdiction}
                  required
                />
              </>
            )}

            {/* Admin code field */}
            {selectedRole === 'admin' && (
              <Input
                label="Admin Registration Code"
                type="password"
                name="adminCode"
                value={formData.adminCode}
                onChange={handleChange}
                placeholder="Enter admin registration code"
                leftIcon={<Lock size={18} />}
                error={errors.adminCode}
                required
              />
            )}
            
            <div className="mt-6">
              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
              >
                Create Account
              </Button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-dark-300">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-500 hover:text-primary-400 transition">
                Sign in
              </Link>
            </p>
          </div>

          {/* Admin registration note */}
          {selectedRole === 'admin' && (
            <div className="mt-6 pt-6 border-t border-dark-800">
              <p className="text-sm text-dark-400 text-center">
                Admin registration requires a valid registration code.
                Contact your system administrator if you don't have one.
              </p>
              <p className="text-xs text-dark-400 text-center mt-2">
                Demo Admin Code: ADMIN123
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;