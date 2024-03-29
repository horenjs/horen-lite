import type { EVENTS } from "@constant";

export function IpcInvoke(event: EVENTS): MethodDecorator {
  return (target: any, propertyName: string) => {
    Reflect.defineMetadata("ipc-invoke", event.toString(), target, propertyName);
  }
}

export function IpcOn(event: EVENTS): MethodDecorator {
  return (target: any, propertyName: string) => {
    Reflect.defineMetadata("ipc-on", event.toString(), target, propertyName);
  }
}

export function Handler(): ClassDecorator {
  return (_: object) => {
    // do nothing
  }
}

export function Injectable(name: string): ClassDecorator {
  return (target: object) => {
    Reflect.defineMetadata("name", name, target);
  }
}