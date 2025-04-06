import { atom } from 'recoil';
export const isLoadingState = atom({
  key: 'isLoadingState',
  default: false
});

export const selectedMetricsState = atom({
  key: "selectedMetricsState",
  default: [],
})

export const userProfileState = atom({
  key: "userProfileState",
  default: null,
})

export const healthDataState = atom({
  key: "healthDataState",
  default: {
    weight: null,
    height: null,
    bmi: null,
    bloodPressure: {
      systolic: null,
      diastolic: null,
    },
    heartRate: null,
  },
})

export const overlayState = atom({
  key: 'isOverlay',
  default: false
});