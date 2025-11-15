import React from "react";

export interface ComponentProp {
    name: string;
    type: string;
    description: string;
    required: boolean;
    default?: string;
}

export interface ComponentExample {
    title: string;
    description?: string;
    code: string;
}

export interface ComponentDoc {
    id: string;
    name: string;
    category: string;
    description: string;
    path: string;
    props?: ComponentProp[];
    examples?: ComponentExample[];
}

export interface Category {
    id: string;
    name: string;
    description: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    color: string;
    count: number;
}
