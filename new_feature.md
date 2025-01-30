### Overall Project Overview

The goal of my project was to make a Desmos-like graphing calculator that could plot and visualize mathematical functions. The project involved creating a canvas-based graphing tool that could render functions, plot points, and display gridlines and axis labels. The user could input mathematical functions, and the tool would render them on the graph.

## Feature Description
The new feature I attempted to add was **dynamically updating the values and grid cell sizes along the axis as I zoom in and out**. The goal was to ensure that the grid numbers and spacing automatically adjust to maintain readability at different zoom levels.

## Why This is a Reasonable Feature for a Frontend Project
This feature is reasonable because:
- It involves modifying canvas rendering logic, which is a frontend task.
- It requires dynamically adjusting UI elements (grid spacing and labels), which is a common requirement in web-based graphing applications.
- No backend or server-side logic is needed; it only requires JavaScript calculations and DOM updates.

## Expected Functionality
1. **Grid Rescaling:** When zooming in, the grid lines should appear denser, and when zooming out, they should spread out.
2. **Number Adjustments:** The numbers along the axes should automatically update to reflect the new scale.
3. **Smooth Transitions:** The transitions between zoom levels should feel natural and not introduce unnecessary jitter or delays.
4. **User Interaction:** The user should be able to zoom using the scroll wheel, and the changes should be immediately reflected on the graph.

## How ChatGPT Failed to Implement It
Despite multiple iterations and refinements, the following issues persisted:

1. **Inconsistent Grid Alignment:** The gridlines failed to remain consistent with the zoom level, never changing their locations correctly.
2. **Unstable Number Scaling:** The axis numbers either did not update correctly or overlapped excessively at high zoom levels, making the graph unreadable.
3. **Laggy Performance:** At higher zoom levels, rendering became slow, leading to an unresponsive user experience.
4. **Unexpected Behavior on Zoom:** Some attempts caused the zoom to break completely, making the grid disappear or distort.
5. **Capped Zoom:** ChatGPT would keep capping the zoom levels, preventing the user from zooming in too far in an attempt to fix the problem, therein creating another problem.

## Attempts to Fix the Issue
### **Attempt 1:** Adjusted grid spacing based on `zoomFactor`.
- **Issue:** Grid lines did not align correctly after zooming.

### **Attempt 2:** Used `Math.log10(zoomFactor)` to dynamically calculate step size.
- **Issue:** Numbers were not updating correctly, and some values appeared too small or too large.

### **Attempt 3:** Combined dynamic scaling with a manual offset correction.
- **Issue:** The performance degraded significantly, and the grid would sometimes disappear entirely.

### **Attempt 4-10:** I continued to prompt GPT to refine the logic, adjust the calculations, and optimize the rendering, and it consistently failed to provide a working solution, oscillating between different issues.

## Conclusion
Despite multiple debugging attempts, the feature did not work as expected. The persistent issues with grid alignment, number updates, and performance suggested that the approach needed a more advanced mathematical transformation or an entirely different rendering method. Since ChatGPT could not provide a working solution after multiple refinements, this qualifies as a feature that it could not successfully implement. This suprised me as I thought it would be able to handle this task and fail in plotting more complex graphs or running more complex calculations. Due to this unexpected wall, I iterated further to refiner other features and improve the overall performance of the graphing calculator after this feature failed for completness.

