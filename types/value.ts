export type State = {
  data: Values;
  deviceData: Devices;
};

export type Values = {
  datacount: number;
  searchEngines: Search_Engine[];
};

export type Search_Engine = {
  id: string;
  engine: string;
  percentage: number;
  createdAt: string;
  updatedAt: string;
};

export type Devices = {
  pc: DeviceInfo;
  smartphone: DeviceInfo;
  data: DeviceData[];
};

export type DeviceInfo = {
  percentage: number;
  count: number;
};

export type DeviceData = {
  id: number;
  type: string;
  deviceId: string;
  os: string;
};
