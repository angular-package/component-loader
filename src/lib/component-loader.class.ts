// angular.
import { ComponentFactory, ComponentFactoryResolver, ComponentRef, ViewContainerRef, Type } from '@angular/core';
// angular-package/type
import { guard, is } from '@angular-package/type';
/**
 * Some useful methods to handle dynamic component.
 * @export
 */
export abstract class ComponentLoader<Component> {

  // Loaded component.
  get component(): ComponentRef<Component> | undefined {
    return this.#component;
  }

  // Container property where Dynamic Component will be put in.
  protected container?: ViewContainerRef;

  // Private component.
  #component: ComponentRef<Component> | undefined;

  // Component resolved factory.
  #factory: ComponentFactory<Component> | undefined;

  /**
   * Creates an instance.
   * @param factoryResolver https://angular.io/api/core/ComponentFactoryResolver
   */
  constructor(public factoryResolver?: ComponentFactoryResolver) {}

  /**
   * 
   * @returns 
   */
  public destroy(): ComponentRef<Component> | undefined {
    if (this.container) {
      if (this.#component) {
        this.#component.destroy();
        this.#component = undefined;

        this.container.clear();
      }
    }
    return this.#component;
  }

  /**
   * Load into the html `#container` resolved factory component.
   * @returns A `ComponentLoader` instance.
   */
  public load(): this {
    if (is.object<ViewContainerRef>(this.container)) {
      if (is.object<ComponentFactory<Component>>(this.#factory)) {
        // TODO: propertyName
        if (is.undefined(this.#component)) {
          this.#component = this.container.createComponent(this.#factory);
        }
      }
    }

    return this;
  }

  /**
   * Resolve component.
   * @param component Component to resolve.
   * @returns 
   */
  public resolve(component: Type<Component>): this {
    if (guard.is.class(component) && this.factoryResolver) {
      this.#factory = this.factoryResolver.resolveComponentFactory(component);
    }
    return this;
  }
}
