# CSS property isolate

The **`isolation`** property determines whether an element should create a new stacking context. A stacking context is an element that has an explicit stacking order relative to other elements on the same level.

## Syntax

```
/* Keyword values */
isolation: auto;
isolation: isolate;

/* Global values */
isolation: inherit;
isolation: initial;
isolation: unset;

```

## Values
- `auto`: The element does not create a new stacking context. This is the default value.
- `isolate`: The element creates a new stacking context. The element's content will be rendered independently from the content of other elements on the same level.
  

## Example 

```
<div class="parent">
  <div class="child"></div>
</div>

```

```
.parent {
  position: relative;
}

.child {
  position: absolute;
  top: 0;
  left: 0;
  width: 100px;
  height: 100px;
  background-color: red;
  opacity: 0.5;
  isolation: isolate;
}

```

In the example above, the .parent element has a position property set to relative. This creates a new stacking context for its child elements. The .child element has a position property set to absolute and an isolation property set to isolate. This causes the .child element to be rendered independently from other elements on the same level, and allows it to appear behind other elements that are not in its stacking context.


## Use case

One use case for the isolation property is when you want to apply an effect or style to an element without affecting other elements on the same level. For example, you may want to apply a filter or blend mode to an image element without affecting the background or other elements on the page. By using the isolation property, you can create a new stacking context for the image element, allowing it to be rendered independently from other elements on the page.

I personally use it for background images with filter blurs.

## Why it is Useful

The isolation property is useful because it allows you to control the rendering order of elements on the page. By creating a new stacking context for an element, you can ensure that it appears in front of or behind other elements as desired. This can be especially useful when working with complex layouts or applying visual effects to elements.