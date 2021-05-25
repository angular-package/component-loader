// external
import { ComponentFactoryResolver, Inject, Injectable, Component } from '@angular/core';

// internal
import { ComponentLoader } from './component-loader.class';

/**
 * Service to make handle loading dynamic component easier.
 * It is created with https://medium.com/@caroso1222/angular-pro-tip-how-to-dynamically-create-components-in-body-ba200cc289e6.
 * @export
 * @extends {ComponentLoaderService}
 * @template Component Component type to load.
 */
@Injectable()
export class ComponentLoaderService<Component> extends ComponentLoader<Component> {
  constructor(public factoryResolver: ComponentFactoryResolver) {
    super(factoryResolver);
  }
}
