/*!
 * Copyright 2020 Ron Buckton
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* @internal */
export class EventEmitter<TEvents extends { [K in keyof TEvents]?: (...args: any[]) => void }> {
    private _observers: Map<EventSubscription, TEvents> | undefined;

    /**
     * Gets the number of subscribed observers.
     */
    get size() {
        return this._observers?.size ?? 0;
    }

    /**
     * Subscribes to one or more events.
     */
    subscribe(events: TEvents): EventSubscription {
        const observers = this._observers ?? (this._observers = new Map<EventSubscription, TEvents>());
        const subscription: EventSubscription = {
            unsubscribe() {
                observers.delete(subscription);
            }
        };
        this._observers.set(subscription, { ...events });
        return subscription;
    }

    /**
     * Emits an event, notifying all observers. Event notification stops if any observer throws an error.
     */
    emit<K extends keyof TEvents>(event: K, ...args: Parameters<NonNullable<TEvents[K]>>): void;
    /**
     * Emits an event, notifying all observers.
     * @param throwOnFirstError When `true`, event notification stops if any observer throws an error.
     * When `false`, all observers are notified. Any errors thrown by observers are collected and thrown as 
     * a single aggregate `Error` (with an `errors` property) after notification has completed.
     */
    emit<K extends keyof TEvents>(throwOnFirstError: boolean, event: K, ...args: Parameters<NonNullable<TEvents[K]>>): void;
    emit(...args: any[]): void {
        const throwOnFirstError: boolean = typeof args[0] === "boolean" ? args.shift() : true;
        const event: keyof TEvents = args.shift();
        if (this._observers !== undefined) {
            if (throwOnFirstError) {
                for (const { [event]: observer } of this._observers.values()) {
                    observer?.(...args);
                }
            }
            else {
                let errors: any[] | undefined;
                for (const { [event]: observer } of this._observers.values()) {
                    try {
                        observer?.(...args);
                    }
                    catch (e) {
                        if (errors === undefined) {
                            errors = [];
                        }
                        errors.push(e);
                    }
                }
                if (errors !== undefined) {
                    const error = new Error("One or more errors occurred");
                    (error as any).errors = errors;
                    throw error;
                }
            }
        }
    }

    /**
     * Removes all subscribed observers.
     */
    clear(): void {
        this._observers?.clear();
    }
}

export interface EventSubscription {
    /**
     * Stops listening to a set of subscribed events.
     */
    unsubscribe(): void;
}