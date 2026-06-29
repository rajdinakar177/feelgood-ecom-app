// app/(admin)/admin/products/[id]/edit/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import ProductForm from "../../_components/ProductForm";

export default function EditProductPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        axios.get(`/api/admin/products/${id}`).then(({ data }) => setProduct(data.data));
    }, [id]);

    if (!product) return <div className="p-6 text-muted-foreground" > Loading...</div>;

    return (
        <div className= "p-6" >
        <h1 className="text-2xl font-semibold mb-6" > Edit Product </h1>
            < ProductForm editData = { product } />
                </div>
  );
}