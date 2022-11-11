/**
 * This file contains functions and components relating to the generation and management of user ids.
 */

/**
 * Max available userid 
 */
const max = Number.MAX_SAFE_INTEGER;

/**
 * Generates a new random user id 
 * @returns A random numberical user id between 0 and max, as defined above
 */
export default function genUserId() {
    return Math.ceil(Math.random() * max);    
}