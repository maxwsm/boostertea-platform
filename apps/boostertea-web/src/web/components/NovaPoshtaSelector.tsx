import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from '../lib/i18n';
import { 
  searchCities, 
  getWarehouses, 
  type NovaPoshtaSettlement, 
  type NovaPoshtaWarehouse,
  formatWarehouseName,
  getWarehouseCategory
} from '../lib/novaposhta';

interface NovaPoshtaSelectorProps {
  onSelect: (data: {
    cityName: string;
    cityRef: string;
    warehouseNumber: string;
    warehouseRef: string;
    warehouseAddress: string;
    fullAddress: string;
  }) => void;
  initialCity?: string;
  initialWarehouse?: string;
  disabled?: boolean;
}

type WarehouseFilter = 'all' | 'branch' | 'postomat' | 'cargo';

const NovaPoshtaSelector = ({ 
  onSelect, 
  initialCity = '', 
  initialWarehouse = '',
  disabled = false 
}: NovaPoshtaSelectorProps) => {
  const { t } = useTranslation();
  
  // City state
  const [cityQuery, setCityQuery] = useState(initialCity);
  const [cities, setCities] = useState<NovaPoshtaSettlement[]>([]);
  const [selectedCity, setSelectedCity] = useState<NovaPoshtaSettlement | null>(null);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [cityLoading, setCityLoading] = useState(false);
  
  // Warehouse state
  const [warehouses, setWarehouses] = useState<NovaPoshtaWarehouse[]>([]);
  const [warehouseQuery, setWarehouseQuery] = useState(initialWarehouse);
  const [selectedWarehouse, setSelectedWarehouse] = useState<NovaPoshtaWarehouse | null>(null);
  const [showWarehouseDropdown, setShowWarehouseDropdown] = useState(false);
  const [warehouseLoading, setWarehouseLoading] = useState(false);
  const [warehouseFilter, setWarehouseFilter] = useState<WarehouseFilter>('all');
  
  // Error state
  const [error, setError] = useState<string | null>(null);
  
  // Refs for click outside
  const cityRef = useRef<HTMLDivElement>(null);
  const warehouseRef = useRef<HTMLDivElement>(null);
  
  // Debounce timer ref
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(event.target as Node)) {
        setShowCityDropdown(false);
      }
      if (warehouseRef.current && !warehouseRef.current.contains(event.target as Node)) {
        setShowWarehouseDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced city search
  const debouncedCitySearch = useCallback((query: string) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    debounceTimer.current = setTimeout(async () => {
      if (query.length < 2) {
        setCities([]);
        return;
      }
      
      setCityLoading(true);
      setError(null);
      
      try {
        const results = await searchCities(query);
        setCities(results);
      } catch (err) {
        setError(t('novaPoshta.errors.citySearch'));
        console.error('City search error:', err);
      } finally {
        setCityLoading(false);
      }
    }, 300);
  }, [t]);

  // Handle city input change
  const handleCityInputChange = (value: string) => {
    setCityQuery(value);
    setSelectedCity(null);
    setWarehouses([]);
    setSelectedWarehouse(null);
    setWarehouseQuery('');
    setShowCityDropdown(true);
    debouncedCitySearch(value);
  };

  // Handle city selection
  const handleCitySelect = async (city: NovaPoshtaSettlement) => {
    setSelectedCity(city);
    setCityQuery(city.Present || city.Description);
    setShowCityDropdown(false);
    
    // Load warehouses for selected city
    setWarehouseLoading(true);
    setError(null);
    
    try {
      const cityRefToUse = city.DeliveryCity || city.Ref;
      const warehouseResults = await getWarehouses(cityRefToUse);
      setWarehouses(warehouseResults);
    } catch (err) {
      setError(t('novaPoshta.errors.warehouseLoad'));
      console.error('Warehouse load error:', err);
    } finally {
      setWarehouseLoading(false);
    }
  };

  // Handle warehouse selection
  const handleWarehouseSelect = (warehouse: NovaPoshtaWarehouse) => {
    setSelectedWarehouse(warehouse);
    setWarehouseQuery(`№${warehouse.Number} - ${warehouse.ShortAddress}`);
    setShowWarehouseDropdown(false);
    
    // Notify parent
    onSelect({
      cityName: selectedCity?.Description || cityQuery,
      cityRef: selectedCity?.DeliveryCity || selectedCity?.Ref || '',
      warehouseNumber: warehouse.Number,
      warehouseRef: warehouse.Ref,
      warehouseAddress: warehouse.ShortAddress,
      fullAddress: `${selectedCity?.Present || cityQuery}, ${warehouse.Description}`,
    });
  };

  // Filter warehouses based on query and type
  const filteredWarehouses = warehouses.filter(w => {
    // Filter by type
    if (warehouseFilter !== 'all') {
      const category = getWarehouseCategory(w);
      if (category !== warehouseFilter) return false;
    }
    
    // Filter by query
    if (warehouseQuery) {
      const query = warehouseQuery.toLowerCase();
      return (
        w.Number.includes(query) ||
        w.Description.toLowerCase().includes(query) ||
        w.ShortAddress.toLowerCase().includes(query)
      );
    }
    
    return true;
  }).slice(0, 50); // Limit displayed results

  // Count warehouses by type for filter badges
  const warehouseCounts = {
    all: warehouses.length,
    branch: warehouses.filter(w => getWarehouseCategory(w) === 'branch').length,
    postomat: warehouses.filter(w => getWarehouseCategory(w) === 'postomat').length,
    cargo: warehouses.filter(w => getWarehouseCategory(w) === 'cargo').length,
  };

  return (
    <div className="space-y-4">
      {/* Error message */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}
      
      {/* City selector */}
      <div ref={cityRef} className="relative">
        <label className="block text-[#F5F0E8]/70 text-sm mb-2">
          {t('novaPoshta.city')} *
        </label>
        <div className="relative">
          <input
            type="text"
            value={cityQuery}
            onChange={(e) => handleCityInputChange(e.target.value)}
            onFocus={() => cityQuery.length >= 2 && setShowCityDropdown(true)}
            placeholder={t('novaPoshta.cityPlaceholder')}
            disabled={disabled}
            className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#F5F0E8]/10 rounded-xl text-[#F5F0E8] placeholder-[#F5F0E8]/30 focus:border-[#9FD356]/50 focus:outline-none transition-colors pr-10"
          />
          {cityLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg className="animate-spin h-5 w-5 text-[#9FD356]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}
          {selectedCity && !cityLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9FD356]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>
        
        {/* City dropdown */}
        {showCityDropdown && cities.length > 0 && (
          <div className="absolute z-50 w-full mt-2 bg-[#1A1A1A] border border-[#F5F0E8]/10 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
            {cities.map((city, index) => (
              <button
                key={city.Ref || index}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); handleCitySelect(city); }}
                className="w-full px-4 py-3 text-left hover:bg-[#9FD356]/10 transition-colors border-b border-[#F5F0E8]/5 last:border-0"
              >
                <div className="text-[#F5F0E8] font-medium">
                  {city.Present || city.Description}
                </div>
                <div className="text-[#F5F0E8]/50 text-sm">
                  {city.AreaDescription && `${city.AreaDescription} обл.`}
                  {city.Warehouses && ` • ${city.Warehouses} ${t('novaPoshta.warehousesCount')}`}
                </div>
              </button>
            ))}
          </div>
        )}
        
        {/* No results message */}
        {showCityDropdown && cities.length === 0 && cityQuery.length >= 2 && !cityLoading && (
          <div className="absolute z-50 w-full mt-2 bg-[#1A1A1A] border border-[#F5F0E8]/10 rounded-xl p-4 text-[#F5F0E8]/50 text-sm">
            {t('novaPoshta.noCitiesFound')}
          </div>
        )}
      </div>
      
      {/* Warehouse selector */}
      {selectedCity && (
        <div ref={warehouseRef} className="relative animate-fadeIn">
          <label className="block text-[#F5F0E8]/70 text-sm mb-2">
            {t('novaPoshta.warehouse')} *
          </label>
          
          {/* Warehouse type filter */}
          <div className="flex gap-2 mb-3 flex-wrap">
            {([
              { key: 'all', label: t('novaPoshta.allWarehouses'), icon: '📍' },
              { key: 'branch', label: t('novaPoshta.branches'), icon: '🏪' },
              { key: 'postomat', label: t('novaPoshta.postomats'), icon: '📦' },
              { key: 'cargo', label: t('novaPoshta.cargo'), icon: '🚛' },
            ] as const).map(({ key, label, icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setWarehouseFilter(key)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-1.5 ${
                  warehouseFilter === key
                    ? 'bg-[#9FD356] text-[#0D0D0D] font-medium'
                    : 'bg-[#F5F0E8]/5 text-[#F5F0E8]/60 hover:bg-[#F5F0E8]/10'
                }`}
              >
                <span>{icon}</span>
                <span>{label}</span>
                <span className={`ml-1 px-1.5 py-0.5 rounded text-xs ${
                  warehouseFilter === key ? 'bg-[#0D0D0D]/20' : 'bg-[#F5F0E8]/10'
                }`}>
                  {warehouseCounts[key]}
                </span>
              </button>
            ))}
          </div>
          
          <div className="relative">
            <input
              type="text"
              value={warehouseQuery}
              onChange={(e) => {
                setWarehouseQuery(e.target.value);
                setShowWarehouseDropdown(true);
              }}
              onFocus={() => setShowWarehouseDropdown(true)}
              placeholder={t('novaPoshta.warehousePlaceholder')}
              disabled={disabled || warehouseLoading}
              className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#F5F0E8]/10 rounded-xl text-[#F5F0E8] placeholder-[#F5F0E8]/30 focus:border-[#9FD356]/50 focus:outline-none transition-colors pr-10"
            />
            {warehouseLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg className="animate-spin h-5 w-5 text-[#9FD356]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}
            {selectedWarehouse && !warehouseLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9FD356]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
          
          {/* Warehouse dropdown */}
          {showWarehouseDropdown && !warehouseLoading && (
            <div className="absolute z-50 w-full mt-2 bg-[#1A1A1A] border border-[#F5F0E8]/10 rounded-xl shadow-2xl overflow-hidden max-h-72 overflow-y-auto">
              {filteredWarehouses.length > 0 ? (
                filteredWarehouses.map((warehouse) => {
                  const category = getWarehouseCategory(warehouse);
                  const icon = category === 'postomat' ? '📦' : category === 'cargo' ? '🚛' : '🏪';
                  
                  return (
                    <button
                      key={warehouse.Ref}
                      type="button"
                      onMouseDown={(e) => { e.preventDefault(); handleWarehouseSelect(warehouse); }}
                      className="w-full px-4 py-3 text-left hover:bg-[#9FD356]/10 transition-colors border-b border-[#F5F0E8]/5 last:border-0"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-lg mt-0.5">{icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-[#F5F0E8] font-medium">
                            №{warehouse.Number}
                          </div>
                          <div className="text-[#F5F0E8]/60 text-sm truncate">
                            {warehouse.ShortAddress}
                          </div>
                          {warehouse.TotalMaxWeightAllowed && (
                            <div className="text-[#F5F0E8]/40 text-xs mt-1">
                              {t('novaPoshta.maxWeight')}: {warehouse.TotalMaxWeightAllowed} {t('novaPoshta.kg')}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="p-4 text-[#F5F0E8]/50 text-sm text-center">
                  {t('novaPoshta.noWarehousesFound')}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Selected info summary */}
      {selectedCity && selectedWarehouse && (
        <div className="p-4 bg-[#9FD356]/10 rounded-xl border border-[#9FD356]/20 animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-[#9FD356] rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-[#0D0D0D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-[#9FD356] font-medium">
                {t('novaPoshta.deliveryPoint')}
              </p>
              <p className="text-[#F5F0E8] text-sm mt-1">
                {selectedCity.Present || selectedCity.Description}
              </p>
              <p className="text-[#F5F0E8]/60 text-sm">
                {t('novaPoshta.warehouseLabel')} №{selectedWarehouse.Number}: {selectedWarehouse.ShortAddress}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default NovaPoshtaSelector;
