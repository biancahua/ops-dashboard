import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MessagesService } from './messages.service';
import { Message } from './entities/messages.entity';

describe('MessagesService', () => {
  let service: MessagesService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockMessage: Message = {
    id: '1',
    phone: 1234567890,
    sender_type: 'customer',
    content: 'Hello, I need help',
    status: 'pending',
    job_type: 'repair',
    urgency: 1,
    timestamp: new Date('2024-01-01T10:00:00Z'),
  };

  const mockBookedMessage: Message = {
    id: '2',
    phone: 1234567890,
    sender_type: 'customer',
    content: 'Book appointment',
    status: 'booked',
    job_type: 'repair',
    urgency: 2,
    timestamp: new Date('2024-01-01T11:00:00Z'),
  };

  const mockBlockedMessage: Message = {
    id: '3',
    phone: 9876543210,
    sender_type: 'customer',
    content: 'Complex issue',
    status: 'blocked_needs_human',
    job_type: 'consultation',
    urgency: 3,
    timestamp: new Date('2024-01-01T12:00:00Z'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        {
          provide: getRepositoryToken(Message),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<MessagesService>(MessagesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all messages when no phone is provided', async () => {
      const mockMessages = [mockMessage, mockBookedMessage, mockBlockedMessage];
      mockRepository.find.mockResolvedValue(mockMessages);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalledWith();
      expect(result).toEqual(mockMessages);
    });

    it('should return messages filtered by phone when phone is provided', async () => {
      const phone = '1234567890';
      const mockMessages = [mockMessage, mockBookedMessage];
      mockRepository.find.mockResolvedValue(mockMessages);

      const result = await service.findAll(phone);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { phone: Number(phone) },
        order: { id: 'ASC' },
      });
      expect(result).toEqual(mockMessages);
    });
  });

  describe('findOne', () => {
    it('should return a single message by id', async () => {
      const id = '1';
      mockRepository.findOne.mockResolvedValue(mockMessage);

      const result = await service.findOne(id);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(mockMessage);
    });

    it('should return null when message is not found', async () => {
      const id = '999';
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne(id);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create and return a new message', async () => {
      const newMessage: Message = {
        id: '4',
        phone: 5555555555,
        sender_type: 'customer',
        content: 'New message',
        status: 'pending',
        job_type: 'maintenance',
        urgency: 1,
        timestamp: new Date(),
      };

      const savedMessage = { ...newMessage };
      mockRepository.save.mockResolvedValue(savedMessage);

      const result = await service.create(newMessage);

      expect(mockRepository.save).toHaveBeenCalledWith(newMessage);
      expect(result).toEqual(savedMessage);
    });
  });

  describe('getHealthMetrics', () => {
    it('should return zero metrics when no messages exist', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.getHealthMetrics();

      expect(result).toEqual({
        resolutionRate: 0,
        escalationRate: 0,
        avgTimeToBooking: 0,
        needsAttentionCount: 0,
      });
    });

    it('should calculate health metrics correctly with mixed message statuses', async () => {
      const allMessages = [mockMessage, mockBookedMessage, mockBlockedMessage];
      const bookedMessages = [mockBookedMessage];
      const blockedMessages = [mockBlockedMessage];

      mockRepository.find
        .mockResolvedValueOnce(allMessages)
        .mockResolvedValueOnce(bookedMessages)
        .mockResolvedValueOnce(blockedMessages);

      const result = await service.getHealthMetrics();

      expect(result).toEqual({
        resolutionRate: 1 / 3,
        escalationRate: 1 / 3,
        avgTimeToBooking: 2.5,
        needsAttentionCount: 1,
      });
    });

    it('should return zero avgTimeToBooking when no booked messages exist', async () => {
      const allMessages = [mockMessage, mockBlockedMessage];
      const bookedMessages: Message[] = [];
      const blockedMessages = [mockBlockedMessage];

      mockRepository.find
        .mockResolvedValueOnce(allMessages)
        .mockResolvedValueOnce(bookedMessages)
        .mockResolvedValueOnce(blockedMessages);

      const result = await service.getHealthMetrics();

      expect(result.avgTimeToBooking).toBe(0);
    });
  });

  describe('getUniqueCustomers', () => {
    it('should return conversation summaries for unique customers', async () => {
      const messages = [mockMessage, mockBookedMessage, mockBlockedMessage];

      mockRepository.find.mockResolvedValue(messages);

      const result = await service.getUniqueCustomers();

      expect(result).toHaveLength(2);
      expect(result).toEqual([
        {
          phone: 1234567890,
          lastMessage: 'Hello, I need help',
          status: 'pending',
          timestamp: '2024-01-01T10:00:00.000Z',
          job_type: 'repair',
          messageCount: 2,
        },
        {
          phone: 9876543210,
          lastMessage: 'Complex issue',
          status: 'blocked_needs_human',
          timestamp: '2024-01-01T12:00:00.000Z',
          job_type: 'consultation',
          messageCount: 1,
        },
      ]);
    });

    it('should limit results when limit parameter is provided', async () => {
      const messages = [mockMessage, mockBookedMessage, mockBlockedMessage];

      mockRepository.find.mockResolvedValue(messages);

      const result = await service.getUniqueCustomers(1);

      expect(result).toHaveLength(1);
      expect(result[0].phone).toBe(1234567890);
    });

    it('should handle messages with null job_type', async () => {
      const messageWithNullJobType: Message = {
        ...mockMessage,
        job_type: null,
      };

      mockRepository.find.mockResolvedValue([messageWithNullJobType]);

      const result = await service.getUniqueCustomers();

      expect(result[0].job_type).toBeNull();
    });

    it('should return empty array when no messages exist', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.getUniqueCustomers();

      expect(result).toEqual([]);
    });
  });
});
