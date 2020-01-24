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

export abstract class BaseCollection<T> {
    abstract values(): Iterable<T>;
    /**
     * Returns `true` if every element in the collection matches the provided callback; otherwise, `false`.
     */
    every(callbackfn: (value: T) => boolean): boolean {
        for (const value of this.values()) {
            if (!callbackfn(value)) return false;
        }
        return true;
    }

    /**
     * Returns `true` if at least one element in the collection matches the provided callback; otherwise, `false`.
     */
    some(callbackfn?: (value: T) => boolean): boolean {
        for (const value of this.values()) {
            if (!callbackfn || callbackfn(value)) return true;
        }
        return false;
    }

    /**
     * Calls the provided callback once for each element in the collection.
     */
    forEach(callbackfn: (value: T) => void): void {
        for (const value of this.values()) {
            callbackfn(value);
        }
    }

    /**
     * Yields the result of calling the provided callback once for each element in the collection.
     */
    * map<U>(callbackfn: (value: T) => U): IterableIterator<U> {
        for (const value of this.values()) {
            yield callbackfn(value);
        }
    }

    /**
     * Yields each element in the collection that matches the provided callback.
     */
    filter<S extends T>(callbackfn: (value: T) => value is S): IterableIterator<S>;
    /**
     * Yields each element in the collection that matches the provided callback.
     */
    filter(callbackfn: (value: T) => boolean): IterableIterator<T>;
    * filter(callbackfn: (value: T) => boolean): IterableIterator<T> {
        for (const value of this.values()) {
            if (callbackfn(value)) {
                yield value;
            }
        }
    }

    /**
     * Calls the specified callback function for each elements in the collection. The return value of the callback is the accumulated result, and is provided as an argument in the next call to the callback.
     */
    reduce<U>(callbackfn: (previousValue: U, currentValue: T) => U, initialValue: U): U {
        let result = initialValue;
        for (const value of this.values()) {
            result = callbackfn(result, value);
        }
        return result;
    }

    /**
     * Finds the first matching element in the collection.
     */
    find<S extends T>(callbackfn: (value: T) => value is S): S | undefined;
    /**
     * Finds the first matching element in the collection.
     */
    find(callbackfn: (value: T) => boolean): T | undefined;
    find(callbackfn: (value: T) => boolean): T | undefined {
        for (const value of this.values()) {
            if (callbackfn(value)) {
                return value;
            }
        }
    }
}
