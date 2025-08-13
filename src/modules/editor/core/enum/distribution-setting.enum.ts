export enum DEFAULT_TIME {
  HOURS = new Date().getHours(),
  MINUTES = new Date().getMinutes()
}

export enum DELIVERY_TYPES {
  SCHEDULED = 'scheduled',
  IMMEDIATE = 'immediate'
}

export enum TemplateType {
  HTML = 'HTML',
  TEXT = 'TEXT'
}

export enum Measurement {
  ON = 1,
  OFF = 0
}