(function () {
  var env = jasmine.getEnv(),
      spyOn = env.spyOn;

  env.spyOn = function (obj, methodName) {
    if ($oop.Class.isPrototypeOf(obj)) {
      return spyOnObjects(obj.__mixins.upstream.list
      .filter(function (Class) {
        return Class.hasOwnProperty(methodName);
      })
      .concat([obj]), methodName);
    } else {
      return spyOn(obj, methodName);
    }
  };
}());