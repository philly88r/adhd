import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApp } from '@/context/AppContext';
import { Brain, Lock } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

export function AuthScreen({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [code, setCode] = useState('');
  const [isError, setIsError] = useState(false);
  const { state } = useApp();
  const { toast } = useToast();

  // Get passcode from settings or use default
  const correctPasscode = state.settings.passcode || '123456';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (code === correctPasscode) {
      // Store authentication state in session storage
      sessionStorage.setItem('isAuthenticated', 'true');
      onAuthenticated();
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in to your productivity app.",
      });
    } else {
      setIsError(true);
      setCode('');
      toast({
        title: "Incorrect passcode",
        description: "Please try again with the correct 6-digit code.",
        variant: "destructive"
      });
      
      // Reset error state after 2 seconds
      setTimeout(() => setIsError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
              <Brain className="h-10 w-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">FocusFlow</CardTitle>
          <p className="text-gray-600 mt-2">Your ADHD-friendly productivity companion</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="passcode" className="text-sm font-medium text-gray-700 block">
                Enter your 6-digit passcode
              </label>
              <div className="relative">
                <Input
                  id="passcode"
                  type="password"
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className={`pl-10 ${isError ? 'border-red-500 animate-shake' : ''}`}
                  maxLength={6}
                  pattern="[0-9]{6}"
                  required
                />
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500">
                Default passcode: 123456
              </p>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
            >
              Unlock App
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
