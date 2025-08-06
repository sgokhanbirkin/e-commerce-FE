import React from 'react';
import { Typography as AntTypography } from 'antd';

const { Title: AntTitle, Text: AntText, Paragraph: AntParagraph, Link: AntLink } = AntTypography;

export interface TitleProps {
    level?: 1 | 2 | 3 | 4 | 5;
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export const Title: React.FC<TitleProps> = ({
    level = 1,
    children,
    className = '',
    style,
}) => {
    const baseClassName = 'kayra-title';
    const levelClassName = `kayra-title--level-${level}`;
    const combinedClassName = `${baseClassName} ${levelClassName} ${className}`.trim();

    return (
        <AntTitle level={level} className={combinedClassName} style={style}>
            {children}
        </AntTitle>
    );
};

export interface TextProps {
    type?: 'secondary' | 'success' | 'warning' | 'danger';
    strong?: boolean;
    italic?: boolean;
    underline?: boolean;
    delete?: boolean;
    mark?: boolean;
    code?: boolean;
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export const Text: React.FC<TextProps> = ({
    type,
    strong = false,
    italic = false,
    underline = false,
    delete: deleteProp = false,
    mark = false,
    code = false,
    children,
    className = '',
    style,
}) => {
    const baseClassName = 'kayra-text';
    const typeClassName = type ? `kayra-text--${type}` : '';
    const combinedClassName = `${baseClassName} ${typeClassName} ${className}`.trim();

    return (
        <AntText
            type={type as any}
            strong={strong}
            italic={italic}
            underline={underline}
            delete={deleteProp}
            mark={mark}
            code={code}
            className={combinedClassName}
            style={style}
        >
            {children}
        </AntText>
    );
};

export interface ParagraphProps {
    strong?: boolean;
    italic?: boolean;
    underline?: boolean;
    delete?: boolean;
    mark?: boolean;
    code?: boolean;
    ellipsis?: boolean | { rows?: number; expandable?: boolean; symbol?: string };
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export const Paragraph: React.FC<ParagraphProps> = ({
    strong = false,
    italic = false,
    underline = false,
    delete: deleteProp = false,
    mark = false,
    code = false,
    ellipsis = false,
    children,
    className = '',
    style,
}) => {
    const baseClassName = 'kayra-paragraph';
    const combinedClassName = `${baseClassName} ${className}`.trim();

    return (
        <AntParagraph
            strong={strong}
            italic={italic}
            underline={underline}
            delete={deleteProp}
            mark={mark}
            code={code}
            ellipsis={ellipsis}
            className={combinedClassName}
            style={style}
        >
            {children}
        </AntParagraph>
    );
};

export interface LinkProps {
    href?: string;
    target?: string;
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

export const Link: React.FC<LinkProps> = ({
    href,
    target,
    children,
    className = '',
    style,
    onClick,
}) => {
    const baseClassName = 'kayra-link';
    const combinedClassName = `${baseClassName} ${className}`.trim();

    return (
        <AntLink
            href={href}
            target={target}
            className={combinedClassName}
            style={style}
            onClick={onClick}
        >
            {children}
        </AntLink>
    );
};

// Export typography components
export const Typography = {
    Title,
    Text,
    Paragraph,
    Link,
}; 