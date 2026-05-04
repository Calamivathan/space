/**
 * Branded unit types per README §6.1. T1 declares the brands; T3 fills
 * in the conversions and constants alongside the metric implementations.
 */

declare const __unit: unique symbol;
type Branded<T, B extends string> = T & { readonly [__unit]: B };

export type Mass = Branded<number, "Mass">; // SI kilograms
export type Length = Branded<number, "Length">; // SI metres
export type Spin = Branded<number, "Spin">; // dimensionless a/M, |a/M| <= 1
export type Charge = Branded<number, "Charge">; // SI coulombs
export type Time = Branded<number, "Time">; // SI seconds
export type Temperature = Branded<number, "Temperature">; // Kelvin

export const Mass = (kg: number): Mass => kg as Mass;
export const Length = (m: number): Length => m as Length;
export const Spin = (am: number): Spin => am as Spin;
export const Charge = (c: number): Charge => c as Charge;
export const Time = (s: number): Time => s as Time;
export const Temperature = (k: number): Temperature => k as Temperature;

/** Physical constants in SI. T3 will extend with G, c, hbar, kB, M_sun. */
export const M_SUN_KG = 1.98847e30;
