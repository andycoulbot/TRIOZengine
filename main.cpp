#include "core/Engine.h"
#include <iostream>

int main() {
    try {
        trioz::Engine engine(1280, 720, "TRIOZengine - 3D Map Engine");
        engine.run();
    } catch (const std::exception& e) {
        std::cerr << "Fatal error: " << e.what() << std::endl;
        return 1;
    }
    return 0;
}
