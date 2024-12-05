export interface AdminDashboardData {
  
  totalRevenue: number;
  studentCount: number;
  instructorCount: number;
  courseCount: number;
}
export interface SalesDataPoint {
  timePeriod: number | string; // Represents the grouped time period (e.g., day, month, year)
  totalRevenue: number;        // Total revenue for the time period
}

// Interface for the fetch function's return type
export interface FetchSalesDataResponse {
  data: SalesDataPoint[];      // Array of sales data points
}
