import { useState, useEffect } from 'react';
import { facilityService } from '../services/facilityService';
import { ConferenceRoom, RoomBooking, CreateRoomBookingDto, UpdateRoomBookingDto, CreateConferenceRoomDto, UpdateConferenceRoomDto } from '../types';

export const useRooms = () => {
  const [rooms, setRooms] = useState<ConferenceRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    
  };

  const updateRoom = async (id: string, data: UpdateConferenceRoomDto) => {
    
  };

  const deleteRoom = async (id: string) => {
    
  };

  return {
    rooms,
    loading,
    error,
    refetch: fetchRooms,
    createRoom,
    updateRoom,
    deleteRoom,
  };
};

export const useBookings = (roomId?: string, startDate?: string, endDate?: string) => {
  const [bookings, setBookings] = useState<RoomBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, [roomId, startDate, endDate]);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    const data = await facilityService.getRoomBookings(roomId, startDate, endDate);
    setBookings(data);
    setLoading(false);
  };

  const createBooking = async (data: CreateRoomBookingDto) => {
    const newBooking = await facilityService.createRoomBooking(data);
    setBookings([...bookings, newBooking]);
    return newBooking;
  };

  const updateBooking = async (id: string, data: UpdateRoomBookingDto) => {
    const updated = await facilityService.updateRoomBooking(id, data);
    setBookings(bookings.map((booking) => (booking.id === id ? updated : booking)));
    return updated;
  };

  const deleteBooking = async (id: string) => {
    await facilityService.deleteRoomBooking(id);
    setBookings(bookings.filter((booking) => booking.id !== id));
  };

  return {
    bookings,
    loading,
    error,
    refetch: fetchBookings,
    createBooking,
    updateBooking,
    deleteBooking,
  };
};

export const useMyBookings = () => {
  const [bookings, setBookings] = useState<RoomBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await facilityService.getMyBookings();
      setBookings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar reservas');
    } finally {
      setLoading(false);
    }
  };

  return { bookings, loading, error, refetch: fetchMyBookings };
};


