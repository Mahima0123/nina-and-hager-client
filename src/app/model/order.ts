import { OrderProduct } from "./orderProduct";

export interface Order {
    orderId?: number;
    userId: number;
    fullName: string;
    address: string;
    email: string;
    phoneNumber: string;
    cartId: number;
    paymentMethod: string;
    products: OrderProduct[];
    createdAt?: Date;
}
