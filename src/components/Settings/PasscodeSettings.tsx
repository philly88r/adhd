import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Lock, Save, Eye, EyeOff } from "lucide-react";

export function PasscodeSettings() {
  const { state, dispatch } = useApp();
  const { toast } = useToast();
  const [currentPasscode, setCurrentPasscode] = useState('');
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [showCurrentPasscode, setShowCurrentPasscode] = useState(false);
  const [showNewPasscode, setShowNewPasscode] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate current passcode
    if (currentPasscode !== state.settings.passcode) {
      setError('Current passcode is incorrect');
      return;
    }

    // Validate new passcode
    if (newPasscode.length !== 6 || !/^\d{6}$/.test(newPasscode)) {
      setError('New passcode must be exactly 6 digits');
      return;
    }

    // Validate confirmation
    if (newPasscode !== confirmPasscode) {
      setError('New passcode and confirmation do not match');
      return;
    }

    // Update passcode
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: {
        passcode: newPasscode
      }
    });

    // Clear form
    setCurrentPasscode('');
    setNewPasscode('');
    setConfirmPasscode('');

    // Show success message
    toast({
      title: "Passcode Updated",
      description: "Your passcode has been successfully changed.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Lock className="h-5 w-5 text-blue-600" />
          <span>Security Settings</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-800 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="current-passcode" className="text-sm font-medium text-gray-700 block">
              Current Passcode
            </label>
            <div className="relative">
              <Input
                id="current-passcode"
                type={showCurrentPasscode ? "text" : "password"}
                placeholder="Enter current 6-digit passcode"
                value={currentPasscode}
                onChange={(e) => setCurrentPasscode(e.target.value)}
                className="pl-10"
                maxLength={6}
                pattern="[0-9]{6}"
                required
              />
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <button 
                type="button"
                className="absolute right-3 top-2.5"
                onClick={() => setShowCurrentPasscode(!showCurrentPasscode)}
              >
                {showCurrentPasscode ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="new-passcode" className="text-sm font-medium text-gray-700 block">
              New Passcode
            </label>
            <div className="relative">
              <Input
                id="new-passcode"
                type={showNewPasscode ? "text" : "password"}
                placeholder="Enter new 6-digit passcode"
                value={newPasscode}
                onChange={(e) => setNewPasscode(e.target.value)}
                className="pl-10"
                maxLength={6}
                pattern="[0-9]{6}"
                required
              />
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <button 
                type="button"
                className="absolute right-3 top-2.5"
                onClick={() => setShowNewPasscode(!showNewPasscode)}
              >
                {showNewPasscode ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirm-passcode" className="text-sm font-medium text-gray-700 block">
              Confirm New Passcode
            </label>
            <div className="relative">
              <Input
                id="confirm-passcode"
                type="password"
                placeholder="Confirm new 6-digit passcode"
                value={confirmPasscode}
                onChange={(e) => setConfirmPasscode(e.target.value)}
                className="pl-10"
                maxLength={6}
                pattern="[0-9]{6}"
                required
              />
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
          >
            <Save className="h-4 w-4 mr-2" />
            Update Passcode
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
