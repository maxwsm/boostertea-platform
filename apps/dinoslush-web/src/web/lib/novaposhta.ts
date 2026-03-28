/**
 * Nova Poshta API Integration
 * 
 * Nova Poshta API v2.0 for city/warehouse search and shipping
 * Documentation: https://developers.novaposhta.ua/documentation
 */

// Nova Poshta API base URL
const NOVA_POSHTA_API_URL = 'https://api.novaposhta.ua/v2.0/json/';

// Types for Nova Poshta API responses
export interface NovaPoshtaCity {
  Ref: string;
  Description: string;
  DescriptionRu: string;
  AreaDescription: string;
  SettlementTypeDescription: string;
  Present: string; // Full display name with type
}

export interface NovaPoshtaWarehouse {
  Ref: string;
  SiteKey: string;
  Description: string;
  DescriptionRu: string;
  ShortAddress: string;
  Number: string;
  TypeOfWarehouse: string;
  CityDescription: string;
  CategoryOfWarehouse: string;
  TotalMaxWeightAllowed: string;
  PlaceMaxWeightAllowed: string;
  Reception?: {
    Monday: string;
    Tuesday: string;
    Wednesday: string;
    Thursday: string;
    Friday: string;
    Saturday: string;
    Sunday: string;
  };
  Schedule?: {
    Monday: string;
    Tuesday: string;
    Wednesday: string;
    Thursday: string;
    Friday: string;
    Saturday: string;
    Sunday: string;
  };
}

export interface NovaPoshtaSettlement {
  Ref: string;
  Description: string;
  SettlementTypeDescription: string;
  RegionsDescription: string;
  AreaDescription: string;
  Present: string;
  DeliveryCity: string;
  Warehouses: string;
}

interface NovaPoshtaResponse<T> {
  success: boolean;
  data: T[];
  errors: string[];
  warnings: string[];
  info: Record<string, string>;
}

// API request wrapper using proxy to avoid CORS
const makeProxyRequest = async <T>(
  modelName: string,
  calledMethod: string,
  methodProperties: Record<string, unknown> = {}
): Promise<T[]> => {
  try {
    const response = await fetch('/api/novaposhta', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        modelName,
        calledMethod,
        methodProperties,
      }),
    });

    if (!response.ok) {
      throw new Error(`Nova Poshta API error: ${response.status}`);
    }

    const result = await response.json() as NovaPoshtaResponse<T>;
    
    if (!result.success) {
      throw new Error(result.errors.join(', ') || 'Nova Poshta API error');
    }

    return result.data;
  } catch (error) {
    console.error('Nova Poshta API error:', error);
    throw error;
  }
};

/**
 * Search for cities/settlements by name
 * Uses Address model with searchSettlements method for best results
 */
export const searchCities = async (query: string): Promise<NovaPoshtaSettlement[]> => {
  if (!query || query.length < 2) {
    return [];
  }

  return makeProxyRequest<NovaPoshtaSettlement>(
    'Address',
    'searchSettlements',
    {
      CityName: query,
      Limit: 20,
      Page: 1,
    }
  );
};

/**
 * Search for cities using getCities method
 * Alternative method that returns more city data
 */
export const getCities = async (query: string): Promise<NovaPoshtaCity[]> => {
  if (!query || query.length < 2) {
    return [];
  }

  return makeProxyRequest<NovaPoshtaCity>(
    'Address',
    'getCities',
    {
      FindByString: query,
      Limit: 20,
      Page: 1,
    }
  );
};

/**
 * Get warehouses for a specific city
 */
export const getWarehouses = async (
  cityRef: string,
  typeOfWarehouseRef?: string
): Promise<NovaPoshtaWarehouse[]> => {
  if (!cityRef) {
    return [];
  }

  return makeProxyRequest<NovaPoshtaWarehouse>(
    'Address',
    'getWarehouses',
    {
      CityRef: cityRef,
      TypeOfWarehouseRef: typeOfWarehouseRef,
      Limit: 500,
      Page: 1,
    }
  );
};

/**
 * Get warehouses by city name (for simpler implementation)
 */
export const getWarehousesByCityName = async (
  cityName: string,
  warehouseType?: 'branch' | 'postomat' | 'cargo'
): Promise<NovaPoshtaWarehouse[]> => {
  if (!cityName) {
    return [];
  }

  const typeMapping = {
    branch: '841339c7-591a-42e2-8571-e2ea0d631e71', // Відділення
    postomat: '95dc212d-479c-4ffb-a8ab-8c1b9073d0bc', // Поштомати
    cargo: '9a68df70-0267-42a8-bb5c-37f427e36ee4', // Вантажні відділення
  };

  return makeProxyRequest<NovaPoshtaWarehouse>(
    'Address',
    'getWarehouses',
    {
      CityName: cityName,
      TypeOfWarehouseRef: warehouseType ? typeMapping[warehouseType] : undefined,
      Limit: 500,
      Page: 1,
    }
  );
};

/**
 * Create TTN (shipping document) - Placeholder
 * In production, this would create actual shipping documents
 */
export interface TTNOrderData {
  senderRef: string;
  senderCity: string;
  senderAddress: string;
  senderContactPerson: string;
  senderPhone: string;
  recipientCity: string;
  recipientAddress: string;
  recipientName: string;
  recipientPhone: string;
  cargoType: 'Parcel' | 'Cargo' | 'Documents' | 'TiresWheels';
  weight: number;
  seatsAmount: number;
  description: string;
  cost: number;
  payerType: 'Sender' | 'Recipient' | 'ThirdPerson';
  paymentMethod: 'Cash' | 'NonCash';
  serviceType: 'DoorsDoors' | 'DoorsWarehouse' | 'WarehouseWarehouse' | 'WarehouseDoors';
}

export const createTTN = async (orderData: TTNOrderData): Promise<{ ttn: string; ref: string }> => {
  // Placeholder - requires merchant account setup
  console.log('Creating TTN for order:', orderData);
  
  // In production, this would call InternetDocument/save
  // return makeProxyRequest<{ IntDocNumber: string; Ref: string }>(
  //   'InternetDocument',
  //   'save',
  //   { ...orderData }
  // );
  
  return {
    ttn: `20450000000000`, // Placeholder TTN
    ref: 'placeholder-ref',
  };
};

/**
 * Track shipment by TTN number
 */
export interface TrackingInfo {
  Number: string;
  StatusCode: string;
  Status: string;
  StatusDescription: string;
  RecipientDateTime: string;
  ActualDeliveryDate: string;
  ScheduledDeliveryDate: string;
  CitySender: string;
  CityRecipient: string;
  WarehouseRecipient: string;
  WarehouseRecipientAddress: string;
}

export const trackPackage = async (ttn: string): Promise<TrackingInfo[]> => {
  if (!ttn) {
    return [];
  }

  return makeProxyRequest<TrackingInfo>(
    'TrackingDocument',
    'getStatusDocuments',
    {
      Documents: [{ DocumentNumber: ttn }],
    }
  );
};

/**
 * Get warehouse types for filtering
 */
export interface WarehouseType {
  Ref: string;
  Description: string;
}

export const getWarehouseTypes = async (): Promise<WarehouseType[]> => {
  return makeProxyRequest<WarehouseType>(
    'Address',
    'getWarehouseTypes',
    {}
  );
};

/**
 * Helper to format warehouse display name
 */
export const formatWarehouseName = (warehouse: NovaPoshtaWarehouse): string => {
  const type = warehouse.CategoryOfWarehouse === 'Postomat' ? '📦' :
               warehouse.CategoryOfWarehouse === 'Branch' ? '🏪' : '📬';
  return `${type} №${warehouse.Number} - ${warehouse.ShortAddress}`;
};

/**
 * Helper to categorize warehouse by type
 */
export const getWarehouseCategory = (warehouse: NovaPoshtaWarehouse): 'branch' | 'postomat' | 'cargo' => {
  if (warehouse.CategoryOfWarehouse === 'Postomat') return 'postomat';
  if (warehouse.Description.toLowerCase().includes('вантажн')) return 'cargo';
  return 'branch';
};
