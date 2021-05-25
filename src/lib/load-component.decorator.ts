import { ComponentLoaderConfig } from '../interface';
import { ComponentLoaderService } from './component-loader.service';

/**
 * Decorator to use `ComponentLoaderService` service with passed variables.
 * @export
 * @param config Main configuration.
 */
export function LoadComponent<Component>(config: ComponentLoaderConfig<Component>): (...args: any) => any {
  return (component: (...args: any) => any): void => {
    // Define component property name.
    // const propertyClass = new PropertyClass();
    // let componentPropertyName = 'componentRef';
    // if ('componentPropertyName' in config) {
    //   if ('prefix' in config.componentPropertyName) {
    //     propertyClass.prefix(config.componentPropertyName.prefix);
    //   }
    //   if ('suffix' in config.componentPropertyName) {
    //     propertyClass.suffix(config.componentPropertyName.suffix);
    //   }
    //   if ('name' in config.componentPropertyName) {
    //     componentPropertyName = propertyClass.name(config.componentPropertyName.name);
    //   } else {
    //     componentPropertyName = propertyClass.name(componentPropertyName);
    //   }
    // }

    // Wrap component methods with loaderService methods.
    Object.defineProperties(component.prototype, {
      componentLoader: {
        get: function componentLoader(): ComponentLoaderService<Component> {
          if (this.componentLoaderService) {
            if (config) {
              if ('container' in config) {
                this.componentLoaderService.container = this[config.container];
              }
              if ('properties' in config) {
                this.componentLoaderService.properties = config.properties;
              }
              if ('component' in config) {
                this.componentLoaderService.resolve(config.component);
              }

              // Define custom component property name.
              // if ('componentPropertyName' in config) {
              //   if ('prefix' in config.componentPropertyName) {
              //     this.componentLoaderService.prefix(config.componentPropertyName.prefix);
              //   }
              //   if ('suffix' in config.componentPropertyName) {
              //     this.componentLoaderService.suffix(config.componentPropertyName.suffix);
              //   }
              //   if ('name' in config.componentPropertyName) {
              //     this.componentLoaderService.componentPropertyName = config.componentPropertyName.name;
              //   }
              // }
            }
          }
          return this.componentLoaderService;
        }
      },
      load: {
        value: function create(source: any): any {
          // this.componentLoader.create().link(source);
        }
      },
      destroy: {
        value: function destroy(): any {
          // this.componentLoader.destroy();
        }
      },
      // [componentPropertyName]: {
      //   get: function componentRefInstance(): DynamicComponent {
      //     if (this.componentLoaderService) {

      //       if (this.componentLoaderService[this.componentLoaderService.component]) {
      //         if ('instance' in this.componentLoaderService[this.componentLoaderService.component]) {
      //           return this.componentLoaderService[this.componentLoaderService.component].instance;
      //         }
      //       }
      //     }
      //   }
      // }
    });
  };
}
