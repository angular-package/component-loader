import { ComponentRef, ViewContainerRef, Type } from '@angular/core';
//
/**
 * Abstract class to handle loading components dynamically.
 */
export abstract class ComponentLoader<DynamicComponent extends object> {
  //#region public instance accessors.
  /**
   * A read-only component of `ComponentRef` type created by a `createComponent()` method.
   * @returns The return value is a component of generic type variable `Dynamic` created by a `ComponentFactory`.
   * @angularpackage
   */
  public get component(): ComponentRef<DynamicComponent> | undefined {
    return this.#component;
  }

  /**
   * A read-only creation state of the dynamic component of a `boolean` type, which by default is set to `false`.
   * @returns The return value is a `boolean` type indicating whether the dynamic component is created.
   * @angularpackage
   */
  public get created(): boolean {
    return this.#created;
  }

  /**
   * The `get` accessor returns an instance of the created dynamic component of generic variable type `DynamicComponent`, or `undefined`.
   * @returns The return value is an instance of `DynamicComponent` if created, otherwise `undefined`.
   * @angularpackage
   */
  public get instance(): DynamicComponent | undefined {
    return this.#component?.instance;
  }
  //#endregion public instance accessors.

  //#region private instance properties.
  /**
   * A privately stored component created by a `createComponent()` method.
   * "Provides access to the component instance and related objects, and provides the means of destroying the instance."
   */
  #component?: ComponentRef<DynamicComponent>;

  /**
   * "Represents a container where one or more views can be attached to a component."
   */
  #container!: ViewContainerRef;

  /**
   * The creation state of a dynamic component of a `boolean` type.
   */
  #created = false;

  /**
   * Dynamic component to load of generic type variable `DynamicComponent`.
   */
  #dynamicComponent?: DynamicComponent;
  //#endregion private instance properties.

  /**
   * Finds the property name that contains container of `ViewContainerRef` in the given `component`.
   * @param component A component of generic object to look in for the container of `ViewContainerRef`.
   * @returns The return value is the property key of string type that contains `ViewContainerRef` in the given `component` or `undefined`.
   * @angularpackage
   */
  static findContainerKey(component: { [k: string]: any }): string | undefined {
    let containerKey: string | undefined;
    for (const [index, key] of Object.keys(component).entries()) {
      if (this.isContainer(component[key])) {
        containerKey = key;
        break;
      }
    }
    return containerKey;
  }

  /**
   * Checks whether the `value` is a `ViewContainerRef` type.
   * @param value The `value` of any type to check.
   * @returns The return value is a `boolean` indicating whether the `value` is a container of `ViewContainerRef`.
   * @angularpackage
   */
  static isContainer(value: any): value is ViewContainerRef {
    return Object.prototype.hasOwnProperty.call(value, '_hostLView');
  }

  /**
   * Creates a child class instance with the optional given dynamic component to load.
   * @param dynamicComponent An optional dynamic component to set with a new child class instance.
   * @angularpackage
   */
  constructor(dynamicComponent?: DynamicComponent) {
    this.#dynamicComponent = dynamicComponent;
  }

  /**
   * Creates component from the given `component` or the stored factory, and loads its host view into the provided or stored existing
   * container. The state of a destroyed component is stored in the property `created`, and its value is set to `false` when the component
   * was successfully destroyed.
   * @param componentType An optional `class` of a `DynamicComponent` type.
   * @param container A container of `ViewContainerRef` type to load component host view to it. By default, it uses the value set by
   * `setContainer()` method.
   * @returns The return value is an instance of a child class.
   * @angularpackage
   */
  public createComponent(
    componentType: Type<DynamicComponent> = this.#dynamicComponent as any,
    container: ViewContainerRef = this.#container
  ): this {
    ComponentLoader.isContainer(container) &&
      !this.isCreated() &&
      ((this.#component = container.createComponent(componentType)),
      (this.#created = this.isCreated()));
    return this;
  }

  /**
   * Destroys the existing component, all of the data structures associated with it, and clears the container. The state of destroying
   * component is stored in the property `created`, and its value is set to `false` when the component was successfully destroyed.
   * @returns The return value is a `boolean` type indicating whether the method successfully destroyed a privately stored component.
   * @angularpackage
   */
  public destroyComponent(): boolean {
    // Stores the result of destroying the component. Should be `false`.
    this.isCreated() &&
      // "Destroys the component instance and all of the data structures associated with it."
      (this.#component?.destroy(),
      // Sets #component to `undefined`.
      (this.#component = undefined),
      // "Destroys all views in this container."
      this.#container.clear());
    this.#created = typeof this.#component === 'undefined';
    return this.#created;
  }

  /**
   * Checks whether the dynamic component is created by using the method `createComponent()`. The result of the check is stored in the
   * `created` accessor.
   * @returns The return value is a `boolean` indicating whether the dynamic component is already created.
   * @angularpackage
   */
  public isCreated(): boolean {
    return typeof this.#component === 'object';
  }

  /**
   * Picks the container of a `ViewContainerRef` from the given `component`.
   * @param component A component of generic object to find container key.
   * @returns The return value is an instance of a child class.
   * @angularpackage
   */
  public pickContainer(component: { [k: string]: any }): this {
    const key = ComponentLoader.findContainerKey(component);
    return (
      typeof key === 'string' && this.setContainer(component[key] as any), this
    );
  }

  /**
   * Sets the given `container` of a `ViewContainerRef` when its property `_hostLView` is found.
   * @param container "Represents a container where one or more views can be attached to a component."
   * @returns The return value is an instance of a child class.
   * @angularpackage
   */
  public setContainer(container: ViewContainerRef): this {
    return (
      ComponentLoader.isContainer(container) && (this.#container = container),
      this
    );
  }

  /**
   * The method sets the dynamic component to create with the `createComponent()`.
   * @param component A component class of the generic type variable `Component` is the dynamic component to create.
   * @returns The return value is an instance of a child class.
   * @angularpackage
   */
  public setDynamicComponent<Component extends DynamicComponent>(
    component: Component
  ): this {
    this.#dynamicComponent = component;
    return this;
  }
}
