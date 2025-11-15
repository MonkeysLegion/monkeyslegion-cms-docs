import { useMemo } from 'react';
import { documentationData } from '@/data/documentation';
import {
    IconForms,
    IconLayoutGrid,
    IconBell,
    IconComponents,
    IconProps,
} from '@tabler/icons-react';
import React from 'react';

const categoryIcons: Record<string, React.ComponentType<IconProps>> = {
    forms: IconForms,
    layout: IconLayoutGrid,
    feedback: IconBell,
    default: IconComponents,
};

export function useDocsNavigation() {
    const navigation = useMemo(() => {
        return documentationData.map((category) => ({
            title: category.title,
            url: `/docs#${category.id}`,
            icon: categoryIcons[category.id] || categoryIcons.default,
            items: category.components.map((component) => ({
                title: component.name,
                url: `/docs/${category.id}/${component.id}`,
            })),
        }));
    }, []);

    return { navigation };
}
