// Define a simplified interface for the products array in the Order interface
export interface OrderProduct {
    product_id: number;
    product_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    sub_total: number;
}