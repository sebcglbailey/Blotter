(function(Blotter, _) {

  Blotter.WindowBlindsMaterial = function() {
    Blotter.Material.apply(this, arguments);
  };

  Blotter.WindowBlindsMaterial.prototype = Object.create(Blotter.Material.prototype);

  Blotter._extendWithGettersSetters(Blotter.WindowBlindsMaterial.prototype, (function () {

    function _mainImageSrc () {
      var mainImageSrc = [
        Blotter.Assets.Shaders.PI,

        "float easingForPositionWithDeadzoneWidth(float position, float deadzoneWidth) {",
        "    // Offset position buy 0.25 so that sin wave begins on a downslope at 0.0",
        "    position += 0.25;",

        "    // Distance of adjusted position from 0.75, min of 0.0 and max of 0.5",
        "    float firstDist = distance(position, 0.75);",

        "    // Divide deadzoneWidth by two, as we will be working it out in either direction from the center position.",
        "    float halfDeadzoneWidth = deadzoneWidth / 2.0;",

        "    // Clamp distance of position from center (0.75) to something between 0.5 and the halfDeadzoneWidth from center.",
        "    float removedDistance = max(firstDist, halfDeadzoneWidth);",

        "    // Find the percentage of removedDistance within the range of halfDeadzoneWidth..0.5",
        "    float distanceOfRange = (removedDistance - halfDeadzoneWidth) / (0.5 - halfDeadzoneWidth);",

        "    // Convert distanceOfRange to a number between 0.0 and 0.5. This means that for any pixel +/- halfDeadzoneWidth from center, the value will be 0.5.",
        "    float offsetDist = (0.5 * (1.0 - (distanceOfRange)));",

        "    if (position < 0.75) {",
        "        position = 0.25 + offsetDist;",
        "    } else {",
        "        position = 1.25 - offsetDist;",
        "    }",


        "    return sin((position) * PI * 2.0) / 2.0;",
        "}",


        "void mainImage( out vec4 mainImage, in vec2 fragCoord )",
        "{",
        "    // Setup ========================================================================",

        "    vec2 uv = fragCoord.xy / uResolution.xy;",

        "    float time = uGlobalTime * uSpeed;",

        "    float directionalAdjustment = uFlipAnimationDirection > 0.0 ? -1.0 : 1.0;",


        "    // Define Axis-Based Striping ===================================================",

        "    float effectPosition = fragCoord.x;",
        "    float effectDimension = uResolution.x;",
        "    if (uAnimateVertically > 0.0) {",
        "       effectPosition = fragCoord.y;",
        "       effectDimension = uResolution.y;",
        "    }",
        "    float stripe = floor(effectPosition / (effectDimension / uDivisions));",


        "    // Animate =====================================================================",

        "    float timeAdjustedForStripe = time - (((uPauseWidth / uDivisions) / effectDimension) * stripe) * directionalAdjustment;",
        "    float offsetAtTime = mod(timeAdjustedForStripe, 1.0);",

        "    // Divide sin output by 2 and add to 0.5 so that sin wave move between 0.0 and 1.0 rather than -1.0 and 1.0.",
        "    // Add 0.25 to offsetAtTime so that as offsetAtTime approaches 0.5, easing will approach 0.0.",
        "    float easing = 0.5 + easingForPositionWithDeadzoneWidth(offsetAtTime, uPauseWidth / effectDimension);",

        "    // Mulptiply offsetAtTime by 2.0 and subtract from 1.0 so that position changes over a range of -1.0 to 1.0 rather than 0.0 to 1.0.",

        "    if (uAnimateVertically > 0.0) {",
        "       uv.y -= ((1.0 - (offsetAtTime * 2.0)) * easing) * directionalAdjustment;",
        "    } else {",
        "       uv.x -= ((1.0 - (offsetAtTime * 2.0)) * easing) * directionalAdjustment;",
        "    }",


        "    mainImage = textTexture(uv);",

        "}"
      ].join("\n");

      return mainImageSrc;
    }

    return {

      constructor : Blotter.WindowBlindsMaterial,

      init : function () {
        this.mainImage = _mainImageSrc();
        this.uniforms = {
          uSpeed : { type : "1f", value : 0.1 },
          uDivisions : { type : "1f", value : 12.0 },
          uPauseWidth : { type : "1f", value : 116.0 },
          uAnimateVertically : { type : "1f", value : 0.0 },
          uFlipAnimationDirection : { type : "1f", value : 0.0 },
        };
      }
    };

  })());

})(
  this.Blotter, this._
);
