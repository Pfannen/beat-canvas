import {
  ComponentPropsWithoutRef,
  FunctionComponent,
  ElementType,
} from "react";

type AsProp<C extends ElementType> = { as: C };

export type OmittedComponentProps<C extends ElementType, Props = {}> = Omit<
  ComponentPropsWithoutRef<C>,
  keyof Props
>;

export type ComponentProps<
  C extends ElementType,
  Props = {}
> = OmittedComponentProps<C, Props> & Props;

export type PolymorphicComponentProps<
  C extends ElementType,
  Props = {}
> = ComponentProps<C, Partial<AsProp<C>> & Props>;

export type PolymorphicComponentPropsD<
  C extends ElementType,
  Props = {}
> = ComponentProps<C, AsProp<C> & Props>;

export type PolymorphicFunctionComponentProps<
  C extends FunctionComponent<any>,
  Props = {}
> = OmmittedFunctionProps<C, AsProp<C> & Props> & (AsProp<C> & Props);

export type OmmittedFunctionProps<
  C extends FunctionComponent<any>,
  Props = {}
> = Omit<ComponentPropsWithoutRef<C>, keyof Props>;
