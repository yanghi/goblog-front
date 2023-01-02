export interface AppConfig {
  baseURL: string;
}

const baseConfig: AppConfig = {
  baseURL: 'http://localhost:8080/api'
  // baseURL: 'http://127.0.0.1:8080/api'
}

export default baseConfig