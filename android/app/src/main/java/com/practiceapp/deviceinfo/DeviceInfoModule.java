package com.practiceapp.deviceinfo; 

import android.content.Context;
import android.os.Build;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.widget.Toast; // Import Toast
import android.os.BatteryManager; // Import BatteryManager
import android.content.Intent; // Import Intent
import android.content.IntentFilter; // Import IntentFilter

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class DeviceInfoModule extends ReactContextBaseJavaModule {

    DeviceInfoModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "DeviceInfoModule";
    }

    // --- getDeviceInfo Method ---
    @ReactMethod
    public void getDeviceInfo(Promise promise) {
        try {
            String deviceInfo = "\nDevice: " + Build.DEVICE
                    + "\nManufacturer: " + Build.MANUFACTURER
                    + "\nModel: " + Build.MODEL
                    + "\nProduct: " + Build.PRODUCT
                    + "\nVersion Release: " + Build.VERSION.RELEASE
                    + "\nVersion SDK: " + Build.VERSION.SDK_INT
                    + "\nFingerprint: " + Build.FINGERPRINT;
            promise.resolve(deviceInfo);
        } catch (Exception e) {
            promise.reject("get_device_info_error", e.getMessage());
        }
    }

    // --- vibrate Method ---
    @ReactMethod
    public void vibrate(Promise promise) {
        try {
            Vibrator v = (Vibrator) getReactApplicationContext().getSystemService(Context.VIBRATOR_SERVICE);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                v.vibrate(VibrationEffect.createOneShot(500, VibrationEffect.DEFAULT_AMPLITUDE));
            } else {
                v.vibrate(500);
            }
            promise.resolve(null);
        } catch (Exception e) {
            promise.reject("vibrate_error", e.getMessage());
        }
    }

    // --- getBatteryLevel Method ---
    @ReactMethod
    public void getBatteryLevel(Promise promise) {
        try {
            String batteryLevelStr = "Unknown";
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                BatteryManager bm = (BatteryManager) getReactApplicationContext()
                        .getSystemService(Context.BATTERY_SERVICE);
                int batteryLevel = bm.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY);
                batteryLevelStr = String.valueOf(batteryLevel) + "%";
            } else {
                // Fallback for older devices
                IntentFilter iFilter = new IntentFilter(Intent.ACTION_BATTERY_CHANGED);
                Intent batteryStatus = getReactApplicationContext().registerReceiver(null, iFilter);
                if (batteryStatus != null) {
                    int level = batteryStatus.getIntExtra(BatteryManager.EXTRA_LEVEL, -1);
                    int scale = batteryStatus.getIntExtra(BatteryManager.EXTRA_SCALE, -1);
                    float batteryPct = level / (float) scale;
                    batteryLevelStr = String.valueOf((int) (batteryPct * 100)) + "%";
                }
            }
            promise.resolve(batteryLevelStr);
        } catch (Exception e) {
            promise.reject("get_battery_error", e.getMessage());
        }
    }

    // --- showNativeToast Method ---
    @ReactMethod
    public void showNativeToast(String message) {
        // Toast UI operations must run on the main (UI) thread
        getReactApplicationContext().runOnUiQueueThread(new Runnable() {
            @Override
            public void run() {
                Toast.makeText(getReactApplicationContext(), message, Toast.LENGTH_LONG).show();
            }
        });
    }
}