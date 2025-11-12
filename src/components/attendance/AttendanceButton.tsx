import React, { useState, useEffect } from 'react';
import { useCheckInOut } from '../../hooks/useAttendance';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { format } from 'date-fns';

export const AttendanceButton: React.FC = () => {
  const { checkIn, checkOut, getCurrentLocation, loading, error, currentAttendance } = useCheckInOut();
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const stored = localStorage.getItem(`attendance_${today}`);
    if (stored) {
      const data = JSON.parse(stored);
      setCheckedIn(data.checkedIn);
      setCheckInTime(data.checkInTime);
    }
  }, []);

  const handleCheckIn = async () => {
    try {
      let location;
      try {
        location = await getCurrentLocation();
      } catch (err) {
        // Location not available - continue without location
      }

      const attendance = await checkIn(location ? { location } : undefined);
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem(`attendance_${today}`, JSON.stringify({
        checkedIn: true,
        checkInTime: attendance.checkIn,
      }));
      setCheckedIn(true);
      setCheckInTime(attendance.checkIn || new Date().toISOString());
    } catch (err) {
      // Check-in failed - error handled by UI
    }
  };

  const handleCheckOut = async () => {
    try {
      let location;
      try {
        location = await getCurrentLocation();
      } catch (err) {
        // Location not available - continue without location
      }

      const attendance = await checkOut(location ? { location } : undefined);
      const today = new Date().toISOString().split('T')[0];
      localStorage.removeItem(`attendance_${today}`);
      setCheckedIn(false);
      setCheckInTime(null);
    } catch (err) {
      // Check-out failed - error handled by UI
    }
  };

  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Controle de Presença</h3>
        
        {error && <ErrorMessage message={error.message} />}

        {!checkedIn ? (
          <div>
            <Button
              onClick={handleCheckIn}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Processando...
                </>
              ) : (
                'Fazer Check-in'
              )}
            </Button>
          </div>
        ) : (
          <div>
            {checkInTime && (
              <div className="mb-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Check-in realizado às</p>
                <p className="text-lg font-semibold text-green-700">
                  {format(new Date(checkInTime), 'HH:mm')}
                </p>
              </div>
            )}
            <Button
              onClick={handleCheckOut}
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Processando...
                </>
              ) : (
                'Fazer Check-out'
              )}
            </Button>
          </div>
        )}

        {currentAttendance && currentAttendance.checkOut && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Check-out realizado às</p>
            <p className="text-lg font-semibold text-blue-700">
              {format(new Date(currentAttendance.checkOut), 'HH:mm')}
            </p>
            {currentAttendance.workHours && (
              <p className="text-sm text-gray-600 mt-1">
                Horas trabalhadas: {currentAttendance.workHours.toFixed(2)}h
              </p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

