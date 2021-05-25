// angular.
import { ComponentFactory, ComponentFactoryResolver, ComponentRef, ViewContainerRef, Type } from '@angular/core';
// angular-package/type
import { guard, is, ResultCallback } from '@angular-package/type';
/**
 * .
 * @export
 */
export abstract class ComponentLoader<Component> {

  // Container.
  public container?: ViewContainerRef; 

  get pick(): any {
    return;
  }

  // Loaded component.
  get component(): ComponentRef<Component> | undefined {
    return this.#component;
  }

  // Component reference instance.
  get instance(): Component | undefined {
    return this.#component?.instance;
  }

  // Created component reference.
  #component?: ComponentRef<Component>;

  // Component resolved factory.
  #factory?: ComponentFactory<Component>;

  /**
   * Creates an instance.
   * @param factoryResolver https://angular.io/api/core/ComponentFactoryResolver
   */
  constructor(public factoryResolver: ComponentFactoryResolver) {}

  /**
   * 
   * @returns 
   */
  public destroy(): ComponentRef<Component> | undefined {
    if (is.object<ComponentRef<Component>>(this.#component)) {
      this.#component.destroy();
      this.#component = undefined;
    }
    if (is.object<ViewContainerRef>(this.container)) {
      this.container.clear();
    }
    return this.#component;
  }

  /**
   * Load into the container resolved factory component.
   * @param component An optional `Component` as constructor value to resolve.
   * @returns A `ComponentLoader` instance.
   */
  public load(component?: Type<Component>): this {
    if (is.object<ViewContainerRef>(this.container) && is.undefined(this.#component)) {
      if (!is.undefined(component) && guard.is.class(component)) {
        this.#component = this.container.createComponent<Component>(this.factory(component));          
      } else if (is.object<ComponentFactory<Component>>(this.#factory)) {
        // TODO: custom #component property name
        this.#component = this.container.createComponent<Component>(this.#factory);
      }
    }
    return this;
  }

  /**
   * Resolve component and store privately.
   * @param component Component to resolve.
   * @returns An `ComponentLoader` instance.
   */
  public resolve(component: Type<Component>, callback?: ResultCallback): this {
    if (guard.is.class(component)) {
      this.#factory = this.factory(component);
    }
    return this;
  }

  /**
   * Retrieve the factory object of a specified component.
   * @param component A `Type<Component>` value to retrieve the factory object.
   * @throws An error if `ComponentFactoryResolver` is not initialized.
   * @returns A factory retrieved from `component` to create a component dynamically. 
   */
  private factory(component: Type<Component>): ComponentFactory<Component> {
    if (guard.is.object(this.factoryResolver) === false) {
      throw new Error(`ComponentFactoryResolver must be initialized`);
    }
    return this.factoryResolver.resolveComponentFactory(component)
  }
}
