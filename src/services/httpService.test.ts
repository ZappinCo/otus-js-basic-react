import { HttpService } from './httpService';

describe('HttpService', () => {
    describe('constructor', () => {
        it('создает экземпляр без baseUrl', () => {
            const service = new HttpService();
            expect(service.baseUrl).toBeNull();
        });

        it('создает экземпляр с baseUrl', () => {
            const service = new HttpService('https://api.example.com');
            expect(service.baseUrl).toBe('https://api.example.com');
        });
    });

    describe('get', () => {
        let service: HttpService;

        beforeEach(() => {
            service = new HttpService();
        });

        it('делает GET запрос и возвращает данные', async () => {
            const mockData = { id: 1, name: 'Test' };
            
            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: async () => mockData
            });

            const result = await service.get('/test');
            
            expect(result).toEqual(mockData);
            expect(fetch).toHaveBeenCalledWith('/test', { method: 'GET' });
        });

        it('выбрасывает ошибку при неудачном запросе', async () => {
            global.fetch = vi.fn().mockResolvedValue({
                ok: false,
                status: 404
            });

            await expect(service.get('/test')).rejects.toThrow('HTTP error! status: 404');
        });

        it('использует baseUrl если он задан', async () => {
            const serviceWithBaseUrl = new HttpService('https://api.example.com');
            
            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({})
            });

            await serviceWithBaseUrl.get('/test');
            
            expect(fetch).toHaveBeenCalledWith('https://api.example.com/test', { method: 'GET' });
        });
    });
});