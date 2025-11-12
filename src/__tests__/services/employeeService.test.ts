import { describe, it, expect, vi, beforeEach } from 'vitest';
import { employeeService } from '../../services/employeeService';
import apiClient from '../../api/client';

vi.mock('../../api/client');

describe('employeeService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch all employees', async () => {
    const mockEmployees = [{ id: '1', name: 'John Doe' }];
    (apiClient.get as jest.MockedFunction<typeof apiClient.get>).mockResolvedValue(mockEmployees);

    const result = await employeeService.getAll();

    expect(apiClient.get).toHaveBeenCalledWith('/employee');
    expect(result).toEqual(mockEmployees);
  });

  it('should fetch employee by id', async () => {
    const mockEmployee = { id: '1', name: 'John Doe' };
    (apiClient.get as jest.MockedFunction<typeof apiClient.get>).mockResolvedValue(mockEmployee);

    const result = await employeeService.getById('1');

    expect(apiClient.get).toHaveBeenCalledWith('/employee/1');
    expect(result).toEqual(mockEmployee);
  });

  it('should create employee', async () => {
    const newEmployee = { name: 'John Doe', email: 'john@example.com' };
    const mockResponse = { id: '1', ...newEmployee };
    (apiClient.post as jest.MockedFunction<typeof apiClient.post>).mockResolvedValue(mockResponse);

    const result = await employeeService.create(newEmployee);

    expect(apiClient.post).toHaveBeenCalledWith('/employee', newEmployee);
    expect(result).toEqual(mockResponse);
  });
});

