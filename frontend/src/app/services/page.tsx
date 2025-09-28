"use client";
import Protected from "@/components/Protected";
import ServicesTable from "@/components/ServicesTable";

export default function ServicesPage() {
    return (
        <Protected>
            <ServicesTable />
        </Protected>
    );
}
