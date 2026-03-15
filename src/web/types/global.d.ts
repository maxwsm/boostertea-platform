import type React from 'react'

declare global {
  namespace JSX {
    type Element = React.JSX.Element
    type IntrinsicElements = React.JSX.IntrinsicElements
    type ElementType = React.JSX.ElementType
    type ElementAttributesProperty = React.JSX.ElementAttributesProperty
    type ElementChildrenAttribute = React.JSX.ElementChildrenAttribute
    type LibraryManagedAttributes<C, P> = React.JSX.LibraryManagedAttributes<C, P>
    type IntrinsicAttributes = React.JSX.IntrinsicAttributes
    type IntrinsicClassAttributes<T> = React.JSX.IntrinsicClassAttributes<T>
  }
}
