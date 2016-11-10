package com.drivestays_app;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.horcrux.svg.RNSvgPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.airbnb.android.react.maps.MapsPackage; // <-- add for react native maps
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import com.BV.LinearGradient.LinearGradientPackage; // <-- add for linear gradient android
import com.oblador.vectoricons.VectorIconsPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new MapsPackage(),
          new LinearGradientPackage(),
          new RNSvgPackage(),
          // new FabricPackage(),
          new VectorIconsPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
      return mReactNativeHost;
  }
}
