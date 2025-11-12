import apiClient from '../api/client';
import { ConferenceRoom, RoomBooking, CreateRoomBookingDto, UpdateRoomBookingDto, CreateConferenceRoomDto, UpdateConferenceRoomDto } from '../types';

export const facilityService = {
  getRooms: async (): Promise<ConferenceRoom[]> => {
    return await apiClient.get('/facilities/rooms');
  },

  getRoomById: async (id: string): Promise<ConferenceRoom> => {
    return await apiClient.get(`/facilities/rooms/${id}`);
  },

  createRoom: async (data: CreateConferenceRoomDto): Promise<ConferenceRoom> => {
    return await apiClient.post('/facilities/rooms', data);
  },

  updateRoom: async (id: string, data: UpdateConferenceRoomDto): Promise<ConferenceRoom> => {
    return await apiClient.patch(`/facilities/rooms/${id}`, data);
  },

  deleteRoom: async (id: string): Promise<void> => {
    await apiClient.delete(`/facilities/rooms/${id}`);
  },

  getBookings: async (roomId?: string, startDate?: string, endDate?: string): Promise<RoomBooking[]> => {
    const params: Record<string, string> = {};
    if (roomId) params.roomId = roomId;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const response = await apiClient.get<RoomBooking[]>('/facilities/bookings', { params });
    return response.data;
  },

  getBookingById: async (id: string): Promise<RoomBooking> => {
    return await apiClient.get(`/facilities/bookings/${id}`);
  },

  createBooking: async (data: CreateRoomBookingDto): Promise<RoomBooking> => {
    return await apiClient.post('/facilities/bookings', data);
  },

  updateBooking: async (id: string, data: UpdateRoomBookingDto): Promise<RoomBooking> => {
    return await apiClient.patch(`/facilities/bookings/${id}`, data);
  },

  deleteBooking: async (id: string): Promise<void> => {
    await apiClient.delete(`/facilities/bookings/${id}`);
  },

  getMyBookings: async (): Promise<RoomBooking[]> => {
    return await apiClient.get('/facilities/my/bookings');
  },

  approve: async (id: string): Promise<RoomBooking> => {
    return await apiClient.post(`/facilities/bookings/${id}/approve`);
  },

  reject: async (id: string, reason: string): Promise<RoomBooking> => {
    return await apiClient.post(`/facilities/bookings/${id}/reject`, { reason });
  },
};

