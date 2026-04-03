import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldHalf, Lock, User } from 'lucide-react';
import { motion } from 'framer-motion';
export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/';
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(username, password);
      // The ProtectedRoute or App router will handle redirecting to the correct dashboard based on role
      // But we can give it a nudge if it's just '/'
      if (from === '/') {
        // We don't know the role here immediately without checking context,
        // but App.tsx will handle the root '/' redirect.
        navigate('/');
      } else {
        navigate(from, {
          replace: true
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{
            scale: 0.9,
            opacity: 0
          }}
          animate={{
            scale: 1,
            opacity: 1
          }}
          className="flex justify-center">
          
          <div className="bg-emerald-700 p-4 rounded-2xl shadow-lg">
            <ShieldHalf className="w-12 h-12 text-white" />
          </div>
        </motion.div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Falcon FC
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Team Management System
        </p>
      </div>

      <motion.div
        initial={{
          y: 20,
          opacity: 0
        }}
        animate={{
          y: 0,
          opacity: 1
        }}
        transition={{
          delay: 0.1
        }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error &&
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            }

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700">
                
                Username
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2.5 border"
                  placeholder="Enter your username" />
                
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700">
                
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2.5 border"
                  placeholder="Enter your password" />
                
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-70 transition-colors">
                
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Demo Credentials
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between bg-gray-50 p-2 rounded">
                <span className="font-medium text-gray-700">Coach:</span>
                <span className="text-gray-600 font-mono">
                  coach / coach123
                </span>
              </div>
              <div className="flex justify-between bg-gray-50 p-2 rounded">
                <span className="font-medium text-gray-700">Player:</span>
                <span className="text-gray-600 font-mono">
                  marcus / player123
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>);

};