import { useState, useEffect } from 'react';
import { attendanceService } from '../services/attendanceService';
import { Attendance, AttendanceSummary, CheckInDto, CheckOutDto } from '../types';

export const useMyAttendance = (startDate?: string, endDate?: string) => {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadAttendance();
  }, [startDate, endDate]);

  const loadAttendance = async () => {
    try {
      setLoading(true);
      const data = await attendanceService.getMyAttendance(startDate, endDate);
      setAttendance(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { attendance, loading, error, refetch: loadAttendance };
};

export const useAttendanceSummary = (startDate: string, endDate: string) => {
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (startDate && endDate) {
      loadSummary();
    }
  }, [startDate, endDate]);

  const loadSummary = async () => {
    try {
      setLoading(true);
      const data = await attendanceService.getMySummary(startDate, endDate);
      setSummary(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { summary, loading, error, refetch: loadSummary };
};

export const useCheckInOut = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentAttendance, setCurrentAttendance] = useState<Attendance | null>(null);

  const checkIn = async (data?: CheckInDto) => {
    try {
      setLoading(true);
      setError(null);
      const attendance = await attendanceService.checkIn(data);
      setCurrentAttendance(attendance);
      return attendance;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const checkOut = async (data?: CheckOutDto) => {
    try {
      setLoading(true);
      setError(null);
      const attendance = await attendanceService.checkOut(data);
      setCurrentAttendance(attendance);
      return attendance;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalização não suportada'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        reject
      );
    });
  };

  return {
    checkIn,
    checkOut,
    getCurrentLocation,
    loading,
    error,
    currentAttendance,
  };
};

export const useAllAttendance = () => {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    try {
      setLoading(true);
      const data = await attendanceService.getAll();
      setAttendance(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { attendance, loading, error, refetch: loadAttendance };
};

