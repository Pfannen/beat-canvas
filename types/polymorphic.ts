import { ComponentPropsWithoutRef, ElementType } from "react";

type AsProp<C extends ElementType> = { as?: C };

type PolymorhpicOmitProps<
  C extends ElementType,
  Props = {}
> = keyof (AsProp<C> & Props);

export type ComponentProps<C extends ElementType, Props = {}> = Omit<
  ComponentPropsWithoutRef<C>,
  keyof Props
> &
  Props;

export type PolymorphicComponentProps<
  C extends ElementType,
  Props = {}
> = ComponentProps<C, PolymorhpicOmitProps<C, Props>>;
